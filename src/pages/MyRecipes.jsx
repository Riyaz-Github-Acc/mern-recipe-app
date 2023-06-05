import axios from "axios";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";

import {ref, deleteObject} from "firebase/storage";
import {storage} from "../Firebase";

import {useGetUserID} from "../hooks/useGetUserID";

import "./MyRecipes.css";
import {Notification} from "../components";

const UserRecipes = () => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [success, setSuccess] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState("");
  const [error, setError] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  const userID = useGetUserID();

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const res = await axios.get(
          `https://mern-recipe-app-api.onrender.com/recipes/user/${userID}/recipes`
        );
        setUserRecipes(res.data.userRecipes);
      } catch (err) {
        setError(true);
        setNotificationError("Something Went Wrong!!!");
      }
    };
    fetchUserRecipes();
  }, [userID]);

  const deleteRecipe = async (recipeId, imageUrl) => {
    try {
      // Delete the recipe from the server
      const res = await axios.delete(
        `https://mern-recipe-app-api.onrender.com/recipes/${recipeId}`,
        {headers: {authorization: cookies.access_token}}
      );

      if (res.status === 200) {
        // Remove the deleted recipe from the local state
        setUserRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe._id !== recipeId)
        );

        // Delete the image file from Firebase Storage
        const fileName = decodeURIComponent(
          imageUrl.split("/").pop().split("?")[0]
        );
        const storageRef = ref(storage, `${fileName}`);
        await deleteObject(storageRef);

        setSuccess(true);
        window.alert(res.data.message);
        setError(false);
        setNotificationError("");
      }
    } catch (err) {
      setError(true);
      setNotificationError("Something Went Wrong!!!");
      setSuccess(false);
      setNotificationSuccess("");
    }
  };

  return (
    <div className="user-recipes">
      <div className="container">
        <h1>My Recipes</h1>
        {userRecipes.length === 0 ? (
          <Notification
            title="No Recipes Found!!!"
            subtitle="Please create some recipes to see here!"
          ></Notification>
        ) : (
          userRecipes.map((recipe) => (
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

              <img src={recipe.imageUrl} alt={recipe.name} />
              <button
                className="btn form-btn home-btn"
                onClick={() => deleteRecipe(recipe._id, recipe.imageUrl)}
              >
                Delete
              </button>
            </div>
          ))
        )}

        {error && <Notification title={notificationError}></Notification>}
      </div>
    </div>
  );
};

export default UserRecipes;
