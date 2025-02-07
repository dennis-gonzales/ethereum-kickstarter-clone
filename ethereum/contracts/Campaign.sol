pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public campaignsAddresses;

    function createCampaign(uint minimumContribution) public {
        address campaign = new Campaign(minimumContribution, msg.sender);
        campaignsAddresses.push(campaign);
    }

    function getCampaignsAddresses() public view returns(address[]) {
        return campaignsAddresses;
    }
}

contract Campaign {
    struct Request {
        mapping(address => bool) approvals;
        uint approvalCount;
        string description;
        address recipient;
        uint value;
        bool complete;
    }
    
    address public manager;
    Request[] public requests;
    mapping(address => bool) public approvers;
    uint public approversCount;
    uint public minimumContribution;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory request = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(request);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns(uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns(uint) {
        return requests.length;
    }
}