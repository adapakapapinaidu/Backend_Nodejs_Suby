
const Firm =require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,'uploads/');
    },
    filename: function(req,res,cb){
        cb(null,Date.now() + '-' +Path.extname(File.originalname));
    }
});

const upload = multer({storage:storage});

const addFirm = async(req,res)=>{
    try {
    const {firmName, area, category, region, offer} = req.body;
    
    const image = req.file? req.filename:undefined;

    const vendor = await Vendor.findById(req.vendorId);
    if(!vendor){
        res.status(404).json({message:"Vendor not found"})
    }

    const firm  = new Firm({
        firmName, area, category, region, offer,image, vendor:vendor._id
    })
    const savedFirm = await firm.save();

    vendor.firm.push(savedFirm);

    await vendor.save();


    return res.status(200).json({message:"Firm Added Successfully"})
    } catch (error) {
       console.error(error);
       res.status(500).json("Internal server error")
    }
    
} 

const deleteFirmById = async(req,res)=>{
    try {
        const firmId = req.params.firmId;

        const deleteProduct = await Firm.findByIdAndDelete(firmId)
        
        if(!deleteProduct){
            return res.status(404).json({error:"No product found"})
        }
    
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal server error"})
    }
}
module.exports = {addFirm: [upload.single('single'),addFirm],deleteFirmById}; 