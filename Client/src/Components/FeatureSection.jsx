import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaRegBuilding,
  FaHome,
  FaBuilding,
  FaLightbulb,
  FaRoad,
  FaWater,
  FaSun,
  FaPlay,
} from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import Carausal from "./Carausal";
import CarouselSlider from "../Pages/CardSlider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../Pages/Spinner"; // Import the Spinner component
import { FaThumbsUp, FaHandshake, FaShieldAlt } from "react-icons/fa";

const FeatureSection = () => {
  const [properties, setProperties] = useState([]);
  const [propertiesImages, setPropertiesImages] = useState([]);
  const [mostViewedProperties, setMostViewedProperties] = useState([]);
  const [mostVisitedProperties, setMostVisitedProperties] = useState([]);
  const [recentlyPosted, setRecentlyPosted] = useState([]);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => setIsVideoOpen((prev) => !prev);
  const { ref, inView } = useInView({
    triggerOnce: true, // The effect will only happen once
    threshold: 0.5, // 50% of the component needs to be visible to trigger the effect
  });
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          "https://real-estate.doaguru.com/api/property/getAllProperty"
        );
        setProperties(response.data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    const fetchPropertyImages = async () => {
      try {
        const response = await axios.get(
          "https://real-estate.doaguru.com/api/property/getAllPropertyImages"
        );
        const { data } = response.data;
        setPropertiesImages(data);
      } catch (error) {
        console.error("Error fetching property images:", error);
      }
    };
    const fetchMostViewedProperties = async () => {
      try {
        const response = await axios.get(
          "https://real-estate.doaguru.com/api/property/getMostVisitedProperties"
        );
        setMostViewedProperties(response.data.data);
      } catch (error) {
        console.error("Error fetching most viewed properties:", error);
      }
    };

    const fetchMostVisitedProperties = async () => {
      try {
        const response = await axios.get(
          "https://real-estate.doaguru.com/api/property/getSuggestedProperty"
        );
        setMostVisitedProperties(response.data.data);
      } catch (error) {
        console.error("Error fetching most visited properties:", error);
      }
    };

    const fetchRecentlyPostedProperties = async () => {
      try {
        const response = await axios.get(
          "https://real-estate.doaguru.com/api/property/getRecentlyPostedProperties"
        );
        setRecentlyPosted(response.data.data);
      } catch (error) {
        console.error("Error in fetching recently posted properties", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([
        fetchProperties(),
        fetchPropertyImages(),
        fetchMostViewedProperties(),
        fetchMostVisitedProperties(),
        fetchRecentlyPostedProperties(),
      ]);
      setLoading(false); // Set loading to false when all data is fetched
    };

    fetchData();
  }, []);

  const categories = [
    {
      name: "villa",
      title: "Villa",
      defaultImage:
        "https://solverwp.com/demo/react/mingrand/assets/img/product/cat-1.png",
    },
    {
      name: "house",
      title: "House",
      defaultImage:
        "https://solverwp.com/demo/react/mingrand/assets/img/product/cat-2.png",
    },
    {
      name: "land",
      title: "Land",
      defaultImage:
        "https://solverwp.com/demo/react/mingrand/assets/img/product/cat-3.png",
    },
    {
      name: "farmLand",
      title: "Farm Land",
      defaultImage:
        "https://solverwp.com/demo/react/mingrand/assets/img/product/cat-4.png",
    },
    {
      name: "commercial",
      title: "Commercial",
      defaultImage:
        "https://solverwp.com/demo/react/mingrand/assets/img/product/cat-4.png",
    },
  ];

  const getCategoryCount = (category) => {
    return properties.filter(
      (property) =>
        property.property_type.toLowerCase() === category.toLowerCase()
    ).length;
  };

  const getCategoryImage = (category, defaultImage) => {
    const property = properties.find(
      (property) =>
        property.property_type.toLowerCase() === category.toLowerCase()
    );
    if (!property) return defaultImage;
    const image = propertiesImages.find(
      (image) => image.property_id === String(property.id)
    );
    return image ? image.image : defaultImage;
  };

  const navigateToCategory = (category) => {
    const filteredProperties = properties.filter(
      (property) =>
        property.property_type.toLowerCase() === category.toLowerCase()
    );
    navigate("/category", { state: { filteredProperties } });
  };

  const getImageForProperty = (propertyId) => {
    const images = propertiesImages.filter(
      (img) => img.property_id === propertyId.toString()
    );
    return images.length > 0 ? images[0].image : "default_image_path"; // replace 'default_image_path' with actual default image path
  };

  const getImagesForCarousel = (properties) => {
    return properties.map((property) => getImageForProperty(property.id));
  };

  if (loading) {
    return <Spinner />; // Show Spinner while loading
  }

  return (
    <div>
      {/* Image Grid Section */}
      <section
        className="mt-8 md:mt-12 max-w-screen mx-auto flex items-center justify-center px-4 hover:cursor-pointer md:mb-6"
        data-aos="zoom-in-up"
       data-aos-duration="1500"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-5xl w-full">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className={`col-span-2 sm:col-span-1 md:col-span-${
                index === 3 ? "4" : "2"
              } relative overflow-hidden h-64 group`}
              onClick={() => navigateToCategory(category.name)} // Add onClick handler to the container
            >
              <img
                loading="lazy"
                src={getCategoryImage(category.name, category.defaultImage)}
                alt={category.title}
                className="transition-transform duration-500 transform group-hover:scale-110 w-full h-full object-cover opacity-95 group-hover:opacity-40 z-0"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all duration-500  pointer-events-none"></div>
              <div className="absolute top-4 left-4 ">
                <p
                  className="text-white text-3xl transition delay-100 ease-in-out transform font-bold"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents event from bubbling up to parent elements
                    navigateToCategory(category.name);
                  }}
                >
                  {category.title}
                </p>
                <p
                  className="text-white font-bold text-xl mt-1 hover:text-green-500 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents event from bubbling up to parent elements
                    navigateToCategory(category.name);
                  }}
                >
                  Available Property ({getCategoryCount(category.name)})
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-8 md:py-12 lg:py-16 xl:py-24">
        <h2 className="text-3xl font-bold text-center mb-6 md:mb-8">
          Explore Our Features
        </h2>
        <div className="container mx-auto px-4"   >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaHome className="text-4xl text-blue-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Buy a Home</h3>
              <p className="text-gray-600">
                Find your dream home from our extensive collection of listings.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaBuilding className="text-4xl text-blue-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Rent a Home</h3>
              <p className="text-gray-600">
                Explore rental options that suit your budget and lifestyle.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaRegBuilding className="text-4xl text-blue-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Sell a Home</h3>
              <p className="text-gray-600">
                Get the best value for your property with our expert assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Carousal */}
      <section className="max-w-screen">
        <p className="text-3xl font-bold flex justify-center p-6  md:mt-5 ">
          {" "}
          Our Properties
        </p>
       <div className="md:pb-5 lg:pb-8" >
       <Carausal />
        </div>
      </section>
      <section className="bg-gray-100 py-8 md:py-12 lg:py-16 xl:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 md:mb-8">
            Why BharatRoofers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaThumbsUp className="text-4xl text-green-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Genuine Property</h3>
              <p className="text-gray-600">
                We offer only genuine properties with verified documents to
                ensure a safe transaction.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaHandshake className="text-4xl text-green-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">No Broker</h3>
              <p className="text-gray-600">
                Directly connect with property owners—no middlemen involved,
                which means better deals for you.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaShieldAlt className="text-4xl text-green-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Trusted Service</h3>
              <p className="text-gray-600">
                Our reputation for honesty and reliability ensures you get the
                best service and support throughout your property journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video section */}
      <section className="mt-5 mb-5 bg-black w-full h-[35rem] relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://c4.wallpaperflare.com/wallpaper/846/173/87/5c1cbaf96bcec-wallpaper-preview.jpg"
            alt="background"
            className="object-cover w-full h-full filter blur-sm opacity-30"
          />
        </div>
        {/* Overlay Text */}
        {!isVideoOpen && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
            <h2 className="text-3xl font-bold mb-4">
              Experience Our Properties Virtually
            </h2>
            <p className="text-lg mb-6">
              Discover the unique features and luxurious amenities of our
              properties. Watch our video tour to get a closer look at what
              makes our listings stand out.
            </p>
            <button
              onClick={handleClick}
              className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition"
            >
              <FaPlay className="inline mr-2" /> Watch Tour
            </button>
          </div>
        )}
        {/* Video Player */}
        {isVideoOpen && (
          <div className="relative w-full h-full">
            <button
              onClick={handleClick}
              className="absolute top-2 right-2 text-white"
            >
              <FaTimes className="text-2xl hover:text-gray-300" />
            </button>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/IjlYXtI2-GU"
              title="Property Tour"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </section>

      {/* 3 carousal */}
      <span className="font-bold flex items-center justify-center text-3xl text-center mb-4 md:mb-6 lg:mb-8 mt-5 md:mt-10 md:pt-4">
        Our Projects
      </span>
      <section className="flex flex-col md:flex-row md:justify-around items-center flex-wrap w-full px-4 md:px-6 lg:px-8 ">
        {[
          "Most Viewed Properties",
          "Recent Projects",
          "Suggested Properties",
        ].map((title, index) => (
          <div
            key={index}
            className="flex flex-col items-center mb-6 md:mb-8 lg:mb-10"
          >
            <p className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
              {title}
            </p>
            {title === "Recent Projects" ? (
              <CarouselSlider
                titles={recentlyPosted.map((prop) => prop.title)}
                propertyName={recentlyPosted.map((prop) => prop.property_name)}
                address={recentlyPosted.map((prop) => prop.property_address)}
                images={getImagesForCarousel(recentlyPosted)}
                price={recentlyPosted.map((prop) => prop.price)}
                datePosted={recentlyPosted.map((prop) => prop.created_at)}
                ids={recentlyPosted.map((property) => property.id)}
              />
            ) : title === "Most Viewed Properties" ? (
              <CarouselSlider
                titles={mostViewedProperties.map((prop) => prop.title)}
                propertyName={mostViewedProperties.map(
                  (prop) => prop.property_name
                )}
                address={mostViewedProperties.map(
                  (prop) => prop.property_address
                )}
                images={getImagesForCarousel(mostViewedProperties)}
                price={mostViewedProperties.map((prop) => prop.price)}
                datePosted={mostViewedProperties.map((prop) => prop.created_at)}
                ids={mostViewedProperties.map((property) => property.id)}
              />
            ) : (
              <CarouselSlider
                titles={mostVisitedProperties.map((prop) => prop.title)}
                propertyName={mostVisitedProperties.map(
                  (prop) => prop.property_name
                )}
                address={mostVisitedProperties.map(
                  (prop) => prop.property_address
                )}
                images={getImagesForCarousel(mostVisitedProperties)}
                price={mostVisitedProperties.map((prop) => prop.price)}
                datePosted={mostVisitedProperties.map(
                  (prop) => prop.created_at
                )}
                ids={mostVisitedProperties.map((property) => property.id)}
              />
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default FeatureSection;
