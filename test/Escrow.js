const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Escrow", () => {
  let buyer, seller, inspector, lender;
  let realEstate, escrow;

  beforeEach(async () => {
    [buyer, seller, inspector, lender] = await ethers.getSigners();

    // Deploy RealEstate contract
    const RealEstate = await ethers.getContractFactory("RealEstate");
    realEstate = await RealEstate.deploy();
    await realEstate.deployed();

    // Mint an NFT
    let transaction = await realEstate
      .connect(seller)
      .mint(
        "https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/1.png"
      );
    await transaction.wait();

    // Deploy Escrow contract
    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      realEstate.address,
      seller.address,
      inspector.address,
      lender.address
    );
    // await escrow.deployed();

    //approve property
    transaction = await realEstate.connect(seller).approve(escrow.address, 1);
    await transaction.wait();

    //list property
    transaction = await escrow.connect(seller).list(1,buyer.address,tokens(10),tokens(5));
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("returns nft address", async () => {
      let result = await escrow.nftAddress();
      expect(result).to.equal(realEstate.address);
    });

    it("returns seller address", async () => {
      let result = await escrow.seller();
      expect(result).to.equal(seller.address);
    });

    it("returns inspector address", async () => {
      let result = await escrow.inspector();
      expect(result).to.equal(inspector.address);
    });

    it("returns lender address", async () => {
      let result = await escrow.lender();
      expect(result).to.equal(lender.address);
    });
  });
  describe("Listing", () => {
    it("updates as listed", async () => {
        
        const result = await escrow.isListed(1);
        expect(result).to.be.equal(true);
    });
    it("updates ownership", async () => {
        //transfer nft from seller to this contract
      expect(await realEstate.ownerOf(1)).to.equal(escrow.address);
    });
    it("returns buyer", async () => {
        const result = await escrow.buyer(1);
        expect(result).to.be.equal(buyer.address);
    });
    it("returns purchase price ", async () => {
        const result = await escrow.purchasePrice(1);
        expect(result).to.be.equal(tokens(10));
    });
    it("returns escrow amt ", async () => {
        const result = await escrow.escrowAmount(1);
        expect(result).to.be.equal(tokens(5));
    });
  });
  describe("Deposits", () => {
    it("updates contract balance", async () => {
        
        const transaction = await escrow.connect(buyer).depositEarnest(1,{value:tokens(5)})
        await transaction.wait();
        const result = await escrow.getBalance();
        expect(result).to.be.equal(tokens(5));
    });
  });
});
