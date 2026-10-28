const express=require('express');
const app=express();
const cors=require('cors');
app.use(cors({
  origin: "https://saa-s-inventory-management-system-t.vercel.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
require("dotenv").config();

const sequelize=require('./config/database');


const cors = require("cors");



// Register your routes AFTER CORS
// Example:
// app.use("/api/auth", authRoutes);


const userRoutes=require('./routes/userRoutes');
const productRoutes=require('./routes/productRoutes');
const dashboardRoutes=require('./routes/dashboardRoutes');
const settingsRoutes=require('./routes/settingsRoutes');


app.use('/api',userRoutes);
app.use('/api',productRoutes);
app.use('/api',dashboardRoutes);
app.use('/api',settingsRoutes);

const PORT=process.env.PORT || 3000;


const User = require('./models/User');
const Organization = require('./models/Organization');

User.belongsTo(Organization, {
  foreignKey: 'OrganizationId',
  as: 'Organization',
});

Organization.hasMany(User, {
  foreignKey: 'OrganizationId',
  as: 'Users',
});
console.log('Associations:', Object.keys(User.associations));

sequelize.sync().then(()=>{
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})
})
.catch((err)=>console.log(err));

module.exports=app;