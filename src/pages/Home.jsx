import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

import { useGetUserID } from "../hooks/useGetUserID";
import tickImg from "../assets/home/tick.png";
import { Notification } from "../components";
import "./Home.css";
import { Circle, SkeletonEffect } from "../components/loader/Loader";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [notificationMap, setNotificationMap] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  const handleNotification = (recipeID) => {
    setNotificationMap((prevMap) => ({
      ...prevMap,
      [recipeID]: true,
    }));
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          "https://mern-recipe-app-api.onrender.com/recipes"
        );
        setRecipes(res.data);
      } catch (err) {
        setError(true);
        setNotificationError("Something Went Wrong!!!");
      }
      setIsLoading(false);
    };

    const fetchSavedRecipe = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `https://mern-recipe-app-api.onrender.com/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(res.data.savedRecipes);
      } catch (err) {
        setError(true);
        setNotificationError("Something Went Wrong!!!");
      }
      setIsLoading(false);
    };
    fetchRecipe();

    if (cookies.access_token) fetchSavedRecipe();
  }, []);

  const userID = useGetUserID();

  const savedRecipe = async (recipeID) => {
    try {
      const res = await axios.put(
        "https://mern-recipe-app-api.onrender.com/recipes",
        {
          recipeID,
          userID,
        },
        { headers: { authorization: cookies.access_token } }
      );
      setSavedRecipes(res.data.savedRecipes);
    } catch (err) {
      setError(true);
      setNotificationError("Something Went Wrong!!!");
    }
  };

  return (
    <div className="home">
      <div className="container">
        <h1>Recipes</h1>

        {error && <Notification title={notificationError}></Notification>}

        {isLoading ? (
          <>
            <SkeletonEffect />
            <SkeletonEffect />
            <SkeletonEffect />
            <SkeletonEffect />
          </>
        ) : recipes.length === 0 ? (
          <Notification
            title="No Recipes Found!!!"
            subtitle="Please create some recipes to see here!"
          ></Notification>
        ) : (
          recipes.map((recipe) => (
            <div className="recipe-card" key={recipe._id}>
              <div className="left">
                <h2>{recipe.name}</h2>
                <ul>
                  <h3>Ingredients:</h3>
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>
                      <b>#</b> {ingredient}
                    </li>
                  ))}
                </ul>

                <div className="instruction">
                  <h3>Instruction:</h3>
                  <p>{recipe.instructions}</p>
                </div>
                <h3>
                  Cooking Time:
                  <span
                    style={{
                      fontWeight: "normal",
                      fontSize: "17px",
                    }}
                  >
                    {" "}
                    {recipe.cookingTime} Minutes
                  </span>
                </h3>
              </div>

              <div className="right">
                <img src={recipe.imageUrl} alt={recipe.name} />

                {!savedRecipes.includes(recipe._id) &&
                  (cookies.access_token ? (
                    <button
                      className="btn form-btn home-btn"
                      onClick={() => savedRecipe(recipe._id)}
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn form-btn home-btn"
                        onClick={() => handleNotification(recipe._id)}
                      >
                        Save
                      </button>
                      {notificationMap[recipe._id] && (
                        <span className="alert">
                          Please Login to Save the Recipe!
                        </span>
                      )}
                    </>
                  ))}

                {savedRecipes.includes(recipe._id) && (
                  <div className="saved">
                    <img src={tickImg} alt="tick" />{" "}
                    <h4 className="success">Already Saved</h4>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
