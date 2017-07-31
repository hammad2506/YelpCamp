var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var User = require("./models/user.js");
var geocoder = require("geocoder");

//dummy data
var userSeed=[
    {
        username: "hammad",
        password: "password"
    },
    {
        username: "campguy",
        password: "password"
    },
    {
        username: "smith",
        password: "password"
    }
];

var seed = [ 
    [
        {
            name: "Desert Masa", 
            image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
            price: 9.79,
            location: "Glen Rouge Campground",
            description: "Located on Doe Lake. The shoreline at the site is sandy and the bottom shallow. You can expect to hike about 2 hours to get there from the Park Office or 2.5 hours from the Big Salmon parking lot. You can canoe to the cluster in about 2 hours from the Park Office on South Otter Lake. This route has a 341m portage. Motorboats are not allowed on Doe Lake. In season, you can fish for Bass and Pike."
        },
        {
            name: "Blue Mountain Light", 
            image: "https://cdn.pixabay.com/photo/2015/07/10/17/24/night-839807__340.jpg",
            price: 14.50,
            location: "Albion Hills Conservation Area",
            description: "Located on the north shore of Big Salmon Lake. The shoreline at the site is rocky and the bottom deep. It takes about 2.5 hours to hike from the Park Office or 1 hour from the Big Salmon parking lot. You can canoe to the cluster in about 0.5 hours from the launch on Big Salmon Lake. There are no portages. Small electric motors are allowed on Big Salmon Lake. In season, you can fish for Lake Trout and Bass."
        },
        {
            name: "Canyon Floor", 
            image: "https://cdn.pixabay.com/photo/2017/06/15/02/31/water-2403909__340.jpg",
            price: 10.50,
            location: "Rattlesnake Point Conservation Area",
            description: "Located about half way on the south shore of Big Salmon Lake. The shoreline at the site is sandy and the bottom shallow. Hiking there takes about 3 hours from the Park Office or 2 hours from the Big Salmon Lake parking lot. Canoeing to the cluster takes about 1-1.5 hours from the dock on Big Salmon Lake. There are no portages. Small electric motors are allowed on Big Salmon Lake. In season, you can fish for Lake Trout and Bass."
        },
        {
            name: "Tropical Falls", 
            image: "https://farm1.staticflickr.com/3/6180383_2bd7676c9b.jpg",
            price: 11.70,
            location: "Rattlesnake Point Conservation Area",
            description: "Located about half way on the south shore of Big Salmon Lake. The shoreline at the site is sandy and the bottom shallow. Hiking there takes about 3 hours from the Park Office or 2 hours from the Big Salmon Lake parking lot. Canoeing to the cluster takes about 1-1.5 hours from the dock on Big Salmon Lake. There are no portages. Small electric motors are allowed on Big Salmon Lake. In season, you can fish for Lake Trout and Bass."
        }
    ],
    
    [
        {
            name: "Cloud's Rest", 
            image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
            price: 9.50,
            location: "Windmill Point Park",
            description: "Located on Doe Lake. The shoreline at the site is sandy and the bottom shallow. You can expect to hike about 2 hours to get there from the Park Office or 2.5 hours from the Big Salmon parking lot. You can canoe to the cluster in about 2 hours from the Park Office on South Otter Lake. This route has a 341m portage. Motorboats are not allowed on Doe Lake. In season, you can fish for Bass and Pike."
        },
        {
            name: "Starry Night", 
            image: "https://cdn.pixabay.com/photo/2016/11/21/14/06/camper-1845590__340.jpg",
            price: 11.75,
            location: "Camp Kodiak",
            description: "Located on the north shore of Big Salmon Lake. The shoreline at the site is rocky and the bottom deep. It takes about 2.5 hours to hike from the Park Office or 1 hour from the Big Salmon parking lot. You can canoe to the cluster in about 0.5 hours from the launch on Big Salmon Lake. There are no portages. Small electric motors are allowed on Big Salmon Lake. In season, you can fish for Lake Trout and Bass."
        },
        {
            name: "Mistykie Lights", 
            image: "https://cdn.pixabay.com/photo/2017/05/05/16/06/teepees-2287571__340.jpg",
            price: 14.25,
            location: "Bronte Creek Provincial Park",
            description: "Located about half way on the south shore of Big Salmon Lake. The shoreline at the site is sandy and the bottom shallow. Hiking there takes about 3 hours from the Park Office or 2 hours from the Big Salmon Lake parking lot. Canoeing to the cluster takes about 1-1.5 hours from the dock on Big Salmon Lake. There are no portages. Small electric motors are allowed on Big Salmon Lake. In season, you can fish for Lake Trout and Bass."
        },
        {
            name: "Logoon Way", 
            image: "https://farm5.staticflickr.com/4110/4847114500_2ee7994f06.jpg",
            price: 10.50,
            location: "Knight's Beach Resort",
            description: "Located about half way on the south shore of Big Salmon Lake. The shoreline at the site is sandy and the bottom shallow. Hiking there takes about 3 hours from the Park Office or 2 hours from the Big Salmon Lake parking lot. Canoeing to the cluster takes about 1-1.5 hours from the dock on Big Salmon Lake. There are no portages. Small electric motors are allowed on Big Salmon Lake. In season, you can fish for Lake Trout and Bass."
        }
    ],
    
    [
        {
            name: "Wintery Winds", 
            image: "https://cdn.pixabay.com/photo/2016/10/23/17/11/camping-1763605__340.jpg",
            price: 8.25,
            location: "Niagra Falls",
            description: "Located on Doe Lake. The shoreline at the site is sandy and the bottom shallow. You can expect to hike about 2 hours to get there from the Park Office or 2.5 hours from the Big Salmon parking lot. You can canoe to the cluster in about 2 hours from the Park Office on South Otter Lake. This route has a 341m portage. Motorboats are not allowed on Doe Lake. In season, you can fish for Bass and Pike."
        },
        {
            name: "Winter Lights", 
            image: "https://cdn.pixabay.com/photo/2016/02/16/13/06/auroras-1203289__340.jpg",
            price: 14.00,
            location: "Flamboro Valley Camping Resort",
            description: "Located on the north shore of Big Salmon Lake. The shoreline at the site is rocky and the bottom deep. It takes about 2.5 hours to hike from the Park Office or 1 hour from the Big Salmon parking lot. You can canoe to the cluster in about 0.5 hours from the launch on Big Salmon Lake. There are no portages. Small electric motors are allowed on Big Salmon Lake. In season, you can fish for Lake Trout and Bass."
        }
        ,
        {
            name: "Yosemite", 
            image: "https://farm4.staticflickr.com/3733/9111171065_792505a0e2.jpg",
            price: 11.00,
            location: "Flamboro Valley Camping Resort",
            description: "Located on the north shore of Big Salmon Lake. The shoreline at the site is rocky and the bottom deep. It takes about 2.5 hours to hike from the Park Office or 1 hour from the Big Salmon parking lot. You can canoe to the cluster in about 0.5 hours from the launch on Big Salmon Lake. There are no portages. Small electric motors are allowed on Big Salmon Lake. In season, you can fish for Lake Trout and Bass."
        },
        {
            name: "Blue Night", 
            image: "https://farm9.staticflickr.com/8002/7299820870_e78782c078.jpg",
            price: 10.50,
            location: "Bluffers Park",
            description: "Located about half way on the south shore of Big Salmon Lake. The shoreline at the site is sandy and the bottom shallow. Hiking there takes about 3 hours from the Park Office or 2 hours from the Big Salmon Lake parking lot. Canoeing to the cluster takes about 1-1.5 hours from the dock on Big Salmon Lake. There are no portages. Small electric motors are allowed on Big Salmon Lake. In season, you can fish for Lake Trout and Bass."
        }
     ]


];

function seedDB(){

User.remove({}, function(err){
    if(err){
        console.log(err);
    }
});

Comment.remove({}, function(err){
    if(err){
        console.log(err);
    }
});
    
Campground.remove({}, function(err){
    if(err){
        console.log(err);
    }
});    
    
userSeed.forEach(function(user){
        User.register(new User({username: user.username}), user.password, function(err, newUser){
        if(err){
            console.log(err);
        }else{
            for(var i=0; i<seed.length; i++){
                seed[i].forEach(function(data){
                   
                    var newCampground = data;
                    newCampground.author = {
                        id: newUser._id,
                        username: newUser.username
                
                    };
                
                geocoder.geocode(newCampground.location, function (err, dataRes) {
                    if(err){
                        console.log(err);
                    }
                    if(dataRes.results[0] === undefined){
                        //console.log("ERROR HERE: "+ data.name);
                        newCampground.lat= 43;
                        newCampground.lng= -79;
                        
                    }
                    else{
                       newCampground.lat = dataRes.results[0].geometry.location.lat;
                        newCampground.lng = dataRes.results[0].geometry.location.lng;
                        newCampground.location = dataRes.results[0].formatted_address;
                    } 
                        Campground.create(newCampground, function(err, campground){
                            
                            if(err){
                                console.log("error:" +campground.name);
                                console.log(err); 
                            }else{
                              //  console.log("success:" + campground.name);
                            }   
                        }); 
                    });
                });
                seed.splice(0,1);
                break;
            }
        }
    });
});    

//+++++++++++++++++++++++++++++++

//         seed.forEach(function(data){
//             Campground.create(data, function(err, addedCamp){
//                 if(err){
//                     console.log(err);
//                 }else{
//                     Comment.create(
//                         {
//                             text: "This place is great, but I wish there was internet",
//                             author: "Homer"
//                         }, function(err, addedComment){
//                             if(err){
//                                 console.log(err);
//                             }else{
//                                 addedCamp.comments.push(addedComment);
//                                 addedCamp.save();
//                             }
//                         });
//                 }
//             });
//         });
    
 

}
    module.exports= seedDB;
    
