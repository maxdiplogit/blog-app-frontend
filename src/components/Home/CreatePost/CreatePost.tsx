// Hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MDEditor, { commands } from "@uiw/react-md-editor";

// Utils
import axios from '../../../utils/axiosPrivate';

// Store Actions
import { authActions } from '../../../store/index';

// Styles
import './CreatePost.css';


const CreatePost = (props: any) => {
    const { setSelectedOption } = props;

    const [ postTitle, setPostTitle ] = useState("");
    const [ mdContent, setMdContent ] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const loggedInUserState = useSelector((state: any) => state.auth.loggedInUser);
    const accessToken = useSelector(    (state: any) => state.auth.loggedInUser.accessToken);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleFormSubmit = async (event: any) => {
        event.preventDefault();

        setErrors({});

        const newErrors: { [key: string]: string } = {};

        if (postTitle === "") {
            newErrors.postTitle = "Post Title is required.";
        }

        if (mdContent === "") {
            newErrors.postContent = "Post Content is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const res = await axios.post('/post/create', {
                postTitle: postTitle,
                postContent: mdContent
            }, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            setSelectedOption("allPosts");
        } catch (error: any) {
            console.log(error);
            if (error.response.status === 403) {
                dispatch(authActions.changeIsLoggedIn(false));
                dispatch(authActions.changeLoggedInUser({
                    userId: "",
                    username: "",
                    email: "",
                    accessToken: "",
                    allPosts: []
                }));
                navigate('/login');
            }
        }
    };

    return (
        <form className="create-post" data-color-mode={ "light" } onSubmit={ handleFormSubmit }>
            <div className="create-post-div">
                <div className="post-title-input">
                    <label htmlFor="create-post-title-input">Post Title</label>
                    <input type="text" id="create-post-title-input" placeholder="Enter" value={ postTitle } onChange={ (e) => {
                        setPostTitle(e.target.value);
                        setErrors((prev) => ({ ...prev, postTitle: "" }));
                    } } />
                    {errors.postTitle && <div className="error-message">{errors.postTitle}</div>}
                </div>
                <div className="post-content">
                    <MDEditor
                        value={ mdContent }
                        onChange={ (val) => {
                            setMdContent(val || "");
                            setErrors((prev) => ({ ...prev, postContent: "" }));
                        } }
                        commands={[
                            commands.bold,
                            commands.italic,
                            commands.link,
                            commands.image,
                        ]}
                        className="md-editor"
                        style={{ maxHeight: '70%', minHeight: '40%', width: '70%', overflowY: 'auto' }}
                    />
                    {errors.postContent && <div className="error-message">{errors.postContent}</div>}
                </div>
                <div>
                    <button className="create-post-button" type="submit">Create</button>
                </div>
            </div>
        </form>
    );
};


export default CreatePost;