pragma solidity ^0.4.17;

contract Hack4Future {

    address private owner;

    function Hack4Future(address _owner) public {
        owner = _owner;
    }

    function destroy() public {
        assert(msg.sender == owner);
        selfdestruct(owner);
    }

    function () payable public {
        throw;
    }

    function deposit() public payable returns (bool success) {
        balances[msg.sender] += msg.value;
        Deposit(msg.sender, msg.value);
        return true;
    }

    function withdraw(uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);

        balances[msg.sender] -= _value;
        msg.sender.send(_value);
        Withdraw(msg.sender, _value);

        return true;
    }

    function sell(address _buyer, string _orderId, uint256 _price) public returns (bool success) {
        require(msg.sender == owner);
        require(balances[_buyer] >= _price);

        balances[_buyer] -= _price;
        owner.send(_price);
        Sell(_buyer, _orderId, _price);

        return true;
    }

    function balanceOf(address _owner) public constant returns (uint256 balance) {
        return balances[_owner];
    }

    event Deposit(address indexed _from, uint256 _value);
    event Withdraw(address indexed _from, uint256 _value);
    event Sell(address indexed _buyer, string _orderId, uint256 _price);

    mapping (address => uint256) balances;
}