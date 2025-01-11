module.exports = (sequelize, Sequelize) => {
    const Utilisateurs = sequelize.define("utilisateurs", {
  
     id: {
          type: Sequelize.STRING,
          primaryKey:true,
          allowNull: false
        },  
      pseudo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pass: {
          type: Sequelize.STRING,
          allowNull: false
      }
   });
  return Utilisateurs;
  };