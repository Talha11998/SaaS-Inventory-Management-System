const express=require('express');
const app=express();
require("dotenv").config();
app.use(express.json());

const sequelize=require('./config/database');

const userRoutes=require('./routes/userRoutes');
const productRoutes=require('./routes/productRoutes');
const dashboardRoutes=require('./routes/dashboardRoutes');
const settingsRoutes=require('./routes/settingsRoutes');


app.use('/api',userRoutes);
app.use('/api',productRoutes);
app.use('/api',dashboardRoutes);
app.use('/e3api',settingsRoutes);

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

sequelize.sync({alter:true}).then(()=>{
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})
})
.catch((err)=>console.log(err));