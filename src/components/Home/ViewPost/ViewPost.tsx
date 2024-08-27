// Hooks
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Markdown from 'markdown-to-jsx';
import MDEditor, { commands } from "@uiw/react-md-editor";

// Utils
import axios from '../../../utils/axiosPrivate';

// Actions
import { authActions } from "../../../store";

// Styles
import './ViewPost.css';


const ViewPost = (props: any) => {
    const { setSelectedOption, setHidePostsPanel, setSelectedPost, selectedPostId, postUserId, selectedPostTitle, selectedPostContent, selectedPostUsername } = props;

    const accessToken = useSelector((state: any) => state.auth.loggedInUser.accessToken);
    const loggedInUserId = useSelector((state: any) => state.auth.loggedInUser.userId);
    const loggedInUserState = useSelector((state: any) => state.auth.loggedInUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [ isUpdating, setIsUpdating ] = useState(false);
    const [ updatePostTitle, setUpdatePostTitle ] = useState("");
    const [ updateMdContent, setUpdateMdContent ] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleFormSubmit = async (event: any) => {
        event.preventDefault();

        setErrors({});

        const newErrors: { [key: string]: string } = {};

        if (updatePostTitle === "") {
            newErrors.updatePostTitle = "Post Title is required";
        }

        if (updateMdContent === "") {
            newErrors.updatePostContent = "Post Content is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const res = await axios.put('/post/update', {
                postId: selectedPostId,
                postTitle: updatePostTitle,
                postContent: updateMdContent
            }, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            dispatch(authActions.changeLoggedInUser({
                ...loggedInUserState,
                allPosts: res.data.allPosts,
            }));
            setSelectedPost("");
            setHidePostsPanel(false);
            setSelectedOption("");
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

    const handleDeletePost = async () => {
        try {
            const data = {
                postId: selectedPostId
            };

            const config = {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
                data: data
            }
            const res = await axios.delete('/post/delete', config);

            dispatch(authActions.changeLoggedInUser({
                ...loggedInUserState,
                allPosts: res.data.allPosts
            }));
            setSelectedPost("");
            setHidePostsPanel(false);
            setSelectedOption("");
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
        <div className="view-post">
            <div className="view-post-title">
                <h1 className="view-post-title-header">{ selectedPostTitle }</h1>
            </div>
            <div className="view-post-content">
                { !isUpdating ? <div className="view-post-content-div">
                    <Markdown className={ "markdown-class" }>
                        { selectedPostContent }
                    </Markdown>
                </div> : <div className="update-post-div">
                    <form className="update-post" data-color-mode={ "light" } onSubmit={ handleFormSubmit }>
                        <div className="update-post-title-input">
                            <label htmlFor="update-post-title-input">Post Title</label>
                            <input type="text" id="update-post-title-input" value={ updatePostTitle } placeholder="Post Title" onChange={ (e) => {
                                setUpdatePostTitle(e.target.value);
                                setErrors((prev) => ({ ...prev, updatePostTitle: "" }));
                            } } />
                            {errors.updatePostTitle && <div className="error-message">{errors.updatePostTitle}</div>}
                        </div>
                        <div className="update-post-content">
                            <MDEditor
                                value={ updateMdContent }
                                onChange={ (val) => {
                                    setUpdateMdContent(val || "");
                                    setErrors((prev) => ({ ...prev, updatePostContent: "" }));
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
                            {errors.updatePostContent && <div className="error-message">{errors.updatePostContent}</div>}
                        </div>
                        <div className="update-action-buttons">
                            <div className="cancel-update-div" onClick={ () => {
                                    setIsUpdating(false);
                                    setHidePostsPanel(false);
                            } }>
                                Cancel
                            </div>
                            <div>
                                <button type="submit" className="make-changes-button">Update</button>
                            </div>
                        </div>
                    </form>
                </div> }
            </div>
            { loggedInUserId === postUserId &&
                <div className="action-buttons">
                    { !isUpdating && <>
                        <div className="update-div" onClick={ () => {
                            console.log(updatePostTitle, updateMdContent);
                            setUpdatePostTitle(selectedPostTitle);
                            setUpdateMdContent(selectedPostContent);
                            setHidePostsPanel(true);
                            setIsUpdating(true);
                        } }>
                            Update
                        </div>
                        <div className="delete-div" onClick={ handleDeletePost }>
                            Delete
                        </div>
                    </>}
                </div>
            }
        </div>
    );
};


export default ViewPost;