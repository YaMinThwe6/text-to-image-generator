const TextToImageDB = require('mongoose');
const Config = require('./Config');
const DBUrl = Config.DB_URL;

const DBConnection = {
    /**
     * DataBase Connection Establish
    **/
    establish: async (Express) => {
        console.log(DBUrl);
        TextToImageDB.connect(DBUrl.TEXT_TO_IMAGE).then(() => {
            console.log('Text to Image database connection established');
            Express.listen(Config.PORT, () => {
                console.log(`Server is running in ${Config.PORT}`);
            });
        }).catch((error)=>{
            console.log(error);
        });
        TextToImageDB.set('debug', true);
    },

    /**
     * To Get Agent DB Connection
     * @returns {*}
     */
    getTextToImageDBConnection: () => {
        return TextToImageDB;
    }
};

module.exports = DBConnection;
