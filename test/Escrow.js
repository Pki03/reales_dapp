const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    let buyer,seller,inspector,lender
        let realEstate

    it('saves the addresses',async () => {
        
        [buyer,seller,inspector,lender ]= await ethers.getSigners();
 
        
        
        //deploy realestate
        const RealEstate = await ethers.getContractFactory('RealEstate');
        realEstate = await RealEstate.deploy();

        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/1.png");
        await transaction.wait();

        const Escrow = await ethers.getContractFactory('Escrow')
        escrow = await Escrow.deploy(realEstate.address,seller.address,inspector.address,lender.address);

        let result = await escrow.nftAddress();
        expect(result).to.be.equal(realEstate.address);
        
        result = await escrow.seller();
        expect(result).to.be.equal(seller.address);
        
    })

})
