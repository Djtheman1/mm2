if game.PlaceId ~= 142823291 then
    game.haha = false;
end

local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local ReplicatedStorage = game:GetService("ReplicatedStorage")

for i,v in pairs(getconnections(LocalPlayer.Idled)) do -- Anti Afk
    v:Disable()
end

local secret = "85cb71959ba5a2df742a2b02a8fda42f75d484b495768da3a4dd9c8f5093cf1c";
local url = "your api link";

-- use ngrok to recieve data froom the bots
-- local HttpRequest = (syn and syn.request) or http and http.request or http_request or (fluxus and fluxus.request) or request
local HttpService = game:GetService("HttpService")
local stop_ping = false;
local tasks = {};
local lock_task = false;
local desposited_data = {};
local trades_completed = 0;
local trade_id = 0;

-- main trade
repeat task.wait() until game:IsLoaded() -- Auto Execute Support


local AutoAcceptOffer = false
local DepositInfo = false
getgenv().SafePlace = false


function OfferItem(item)
    local args = {
        [1] = item,
        [2] = "Weapons"
    }
    ReplicatedStorage.Trade.OfferItem:FireServer(unpack(args))
end

function AddItems(items, old_trade_id)

    repeat wait(1) until LocalPlayer.PlayerGui.TradeGUI.Enabled or LocalPlayer.PlayerGui.TradeGUI_Phone.Enabled

    if old_trade_id ==  trade_id then
        for _, item in items do
            OfferItem(item)
            wait(0.1);
        end
    end

end

function IsInTrade()
    local tradeStatus = ReplicatedStorage.Trade.GetTradeStatus:InvokeServer()
    return tradeStatus ~= "None"
end

function FindNewItems(oldData, newData) -- Should be the best way of doing it
    local newAcquisitions = {}
    for weaponName, newQuantity in pairs(newData) do
        local oldQuantity = oldData[weaponName] or 0
        if newQuantity > oldQuantity then
            newAcquisitions[weaponName] = newQuantity - oldQuantity
        end
    end
    return  newAcquisitions
end


local trading = false;

function AutoAcceptOfferLoop()
    while true do
        wait(1);
        repeat wait(1) until not trading
        ReplicatedStorage.Trade.AcceptRequest:FireServer()
    end
end


local StartTraderemote = game.ReplicatedStorage:FindFirstChild("StartTrade", true)

local trading_player = nil;
local return_withdraw_items = {};
local withdraw_list = nil;
local deposit_list = nil;

-- get trading player
StartTraderemote.OnClientEvent:Connect(function(data, playerName)
    trade_id = trade_id + 1;
    trading_player =  game.Players[playerName];
    return_withdraw_items = {};
    
    withdraw_list = nil;
    deposit_list = nil;

    local response = http_request(
    {
        Url = url.."/withdrawals/mm2", 
        Method = "POST",
        Headers = {
            ["Content-Type"] = "application/json"  -- When sending JSON, set this!
        },
        Body = game:GetService("HttpService"):JSONEncode({
           secret = secret,
           userId = trading_player.UserId
        })
    })

    local withdraw_ing_items = {};

    for i,v in pairs(response) do
        if i == "Body" then 
            local items = game:GetService("HttpService"):JSONDecode(v);
            local count = 0;

            for _, item in items do
                table.insert(return_withdraw_items, item);
                table.insert(withdraw_ing_items, item.item_name);
            end
        end
    end

    AddItems(withdraw_ing_items, trade_id);
end)


-- auto accept
local remote = game.ReplicatedStorage:FindFirstChild("AcceptTrade", true)
remote.OnClientEvent:Connect(function(isBot, deposits)
    if remote.Name == "AcceptTrade" and not trading and not isBot then
        trading = true;

        local args = {
            [1] = 285646582
        }
        
        game:GetService("ReplicatedStorage").Trade.AcceptTrade:FireServer(unpack(args))

        wait(5);

        if not withdraw_list then
            trading = false
        end
    end
end)


-- to database
local remote = game.ReplicatedStorage:FindFirstChild("AcceptTrade", true)
remote.OnClientEvent:Connect(function(isBot, deposits)
    if remote.Name == "AcceptTrade" and isBot then
        if deposits then
            for _, item in deposits do
                deposit_list = deposit_list or {}
                deposit_list[item[1]] = item[2]
            end
        end
        
        if deposit_list then
            DepositClash(trading_player, deposit_list)
        end

        if withdraw_list then
            WithdrawClash(trading_player, withdraw_list)
            trading = false;
        end
    end
end)


-- Depo/Withdraw list update
local remote = game.ReplicatedStorage:FindFirstChild("UpdateTrade", true)
remote.OnClientEvent:Connect(function(content)
    if not content then
        return;
    end

    if content.Player2 and content.Player2.Offer then
        for _, item in content.Player2.Offer do
            withdraw_list = withdraw_list or {}
            withdraw_list[item[1]] = item[2]
        end
    end

end)

local AutoAcceptOfferCoroutine = coroutine.create(AutoAcceptOfferLoop)
coroutine.resume(AutoAcceptOfferCoroutine)


function DepositClash(player, deposited)

    local item_data = {};

    for _, item in deposited do
        table.insert(item_data, {
            item_name = _,
            count = item
        }) 
    end

    local response = http_request(
    {
        Url = url.."/deposit/mm2",  -- ngrok
        Method = "POST",
        Headers = {
            ["Content-Type"] = "application/json"  -- When sending JSON, set this!
        },
        Body = game:GetService("HttpService"):JSONEncode({
            userId = player.UserId,
            secret = secret,
            depositItems = item_data
        })
    })
end


function WithdrawClash(player, withdrew)

    local item_data = {};

    for itemName, count in withdrew do

        for i=1, count, 1 do
            local pos = nil;

            for __, real_item in return_withdraw_items do
                if(real_item.item_name == itemName) then
                    pos = __;
                    break;
                end
            end

            if pos then
                table.insert(item_data, return_withdraw_items[pos])
                table.remove(return_withdraw_items, pos)
            end
        end
        
    end

    

    local response = http_request(
    {
        Url = url.."/withdraw/mm2/clear",  -- ngrok
        Method = "POST",
        Headers = {
            ["Content-Type"] = "application/json"  -- When sending JSON, set this!
        },
        Body = game:GetService("HttpService"):JSONEncode({
            userId = player.UserId,
            secret = secret,
            clearedItems = item_data
        })
    })

end

print("mm2clash bot")
