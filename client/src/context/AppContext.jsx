import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const loadCreditData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/credits", {
        headers: { token },
      });

      //console.log("data from load credit = ", data);

      if (data.success) {
        //console.log("Inside Data success");
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
      //console.log("Credit API error response", error.response?.data || error);
      toast.error(error.message);
    }
  };

  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/generate-image",
        { prompt },
        { headers: { token } }
      );

      if (data.success) {
        //console.log("Inside data.success for image = ", data)
        loadCreditData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        loadCreditData();
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      // console.log( "Image Generation error response ", error.response?.data || error );
      toast.error(error.message);
    }
  };


  const generateThumbnail = async ({ prompt, cloudinaryPublicId}) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/generate/generate-thumbnail",
        { prompt, cloudinaryPublicId },
        { headers: { token } }
      );

      if (data.success) {
        loadCreditData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        loadCreditData();
        if (data.creditBalance === 0) navigate("/buy");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const uploadToCloudinary = async (file, { folder } = {}) => {
    const sigRes = await axios.post(
      backendUrl + "/api/cloudinary/signature",
      { folder },
      { headers: { token } }
    );
    const { signature, timestamp, apiKey, cloudName } = sigRes.data || {};
    if (!signature || !timestamp || !apiKey || !cloudName) {
      throw new Error("Failed to get Cloudinary signature");
    }

    // 2) direct upload to Cloudinary
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp)); // seconds
    form.append("signature", signature);
    if (folder) form.append("folder", folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const resp = await fetch(uploadUrl, { method: "POST", body: form });
    if (!resp.ok) throw new Error("Cloudinary upload failed");
    const json = await resp.json();
    // returns public_id, secure_url, etc.
    return json;
  }


  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    if (token) {
      loadCreditData();
    }
  }, [token]);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditData,
    logout,
    generateImage,
    uploadToCloudinary,
    generateThumbnail,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
