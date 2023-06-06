import axios from "axios";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage } from "../Firebase";
import { useGetUserID } from "../hooks/useGetUserID";

import ImgPlaceholder from "../assets/create-recipe/img-placeholder.png";

import "./CreateRecipe.css";

const CreateRecipe = () => {
  const userID = useGetUserID();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [notificationError, setNotificationError] = useState("");
  const [success, setSuccess] = useState(false);

  const [fileUpload, setFileUpload] = useState("");
  const [isUploading, setIsUploading] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);

  const [cookies, _] = useCookies(["access_token"]);

  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (e, i) => {
    const { value } = e.target;
    const ingredients = recipe.ingredients;
    ingredients[i] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const handleAddIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";
      if (isFileSelected) {
        imageUrl = await uploadFile();
      }

      const newRecipe = {
        ...recipe,
        imageUrl,
      };

      await axios.post(
        "https://mern-recipe-app-api.onrender.com/recipes",
        newRecipe,
        {
          headers: { authorization: cookies.access_token },
        }
      );

      setSuccess(true);
      window.alert("Recipe created successfully!!!");
      navigate("/");
    } catch (err) {
      setError(true);
      setNotificationError(err.message);
    }
  };

  const uploadFile = () => {
    return new Promise((resolve, reject) => {
      const fileName = new Date().getTime() + fileUpload.name;
      const storageRef = ref(storage, `recipeImages/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, fileUpload);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setIsUploading(progress);
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  return (
    <div className="create-recipe">
      <div className="container">
        <h1>Create Recipes</h1>
        {cookies.access_token ? (
          <form className="form cre-rec-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ingredients">Ingredients</label>
              {recipe.ingredients.map((ingredient, i) => (
                <input
                  key={i}
                  type="text"
                  name="ingredients"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(e, i)}
                />
              ))}
              <button
                type="button"
                className="btn form-btn ordinary-btn"
                onClick={handleAddIngredient}
              >
                Add Ingredient
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="instructions">Instructions</label>
              <textarea
                type="text"
                id="instructions"
                name="instructions"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <div>Upload Image</div>
              <label htmlFor="imageUrl" className="img-upload">
                <img
                  src={
                    fileUpload
                      ? URL.createObjectURL(fileUpload)
                      : ImgPlaceholder
                  }
                  alt=""
                />
              </label>
              <input
                style={{ display: "none" }}
                type="file"
                id="imageUrl"
                name="imageUrl"
                onChange={(e) => {
                  setFileUpload(e.target.files[0]);
                  setIsFileSelected(true);
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cookingTime">Cooking Time</label>
              <input
                type="number"
                id="cookingTime"
                name="cookingTime"
                onChange={handleChange}
              />
            </div>

            <button
              disabled={isUploading !== null && isUploading < 100}
              type="submit"
              className="btn form-btn disabled-btn"
            >
              Create
            </button>

            {error && <span className="alert">{notificationError}</span>}
          </form>
        ) : (
          <span className="cre-rec-notify">
            Please{" "}
            <Link to="/auth" className="link">
              Login
            </Link>{" "}
            to Create a Recipe!
          </span>
        )}
      </div>
    </div>
  );
};

export default CreateRecipe;
