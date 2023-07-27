const mongoose = require('mongoose');
const Campground = require('../modeldata/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp')
    .then(()=>{
        console.log('DB CONNECTED')
    })
    .catch(err =>{
        console.log("ERROR, COULD NOT CONNECT")
        console.logg(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for (let i=0; i<1000; i++){
        const randn = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*(100 - 50)) +50;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[randn].city}, ${cities[randn].state}`,
            images:  [
                {
                  url: 'https://res.cloudinary.com/dyzxpztvv/image/upload/v1688476536/Yelp/a9ia1kq5kskgxhjyzbdr.jpg',
                  filename: 'Yelp/a9ia1kq5kskgxhjyzbdr',
                },
                {
                  url: 'https://res.cloudinary.com/dyzxpztvv/image/upload/v1688476537/Yelp/kzpyat5ifapal9ysks4o.jpg',
                  filename: 'Yelp/kzpyat5ifapal9ysks4o',
                }
              ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, nemo architecto facere repellendus similique minus saepe laudantium? Quas in veritatis eligendi aliquid repudiandae, dicta, ducimus quasi at reprehenderit deleniti nam!',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randn].longitude,
                    cities[randn].latitude,
                ]
            },
            owner: "64a1df7761bd1624b557122e"
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})