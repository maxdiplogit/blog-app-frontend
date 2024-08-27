// Hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "./CreatePost/CreatePost";
import ViewPost from "./ViewPost/ViewPost";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import CreateIcon from '@mui/icons-material/Create';
import LogoutIcon from '@mui/icons-material/Logout';

// Utils
import axios from '../../utils/axiosPrivate';

// Store Actions
import { authActions } from '../../store/index';

// Styles
import './Home.css';


const Home = () => {
    const [ selectedOption, setSelectedOption ] = useState("allPosts");
    const [ userPosts, setUserPosts ] = useState([]);
    const [ selectedPost, setSelectedPost ] = useState("");
    const [ postUserId, setPostUserId ] = useState("");
    const [ selectedPostTitle, setSelectedPostTitle ] = useState("");
    const [ selectedPostUsername, setSelectedPostUsername ] = useState("");
    const [ selectedPostContent, setSelectedPostContent ] = useState("");
    const [ hidePostsPanel, setHidePostsPanel ] = useState(false);

    const loggedInUserState = useSelector((state: any) => state.auth.loggedInUser);
    const loggedInUserId = useSelector((state: any) => state.auth.loggedInUser.userId);
    const accessToken = useSelector((state: any) => state.auth.loggedInUser.accessToken);
    const allPosts = useSelector((state: any) => state.auth.loggedInUser.allPosts);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const res = await axios.post('/auth/logout', {}, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
    
            dispatch(authActions.changeIsLoggedIn(false));
            dispatch(authActions.changeLoggedInUser({
                userId: "",
                username: "",
                email: "",
                accessToken: "",
                allPosts: []
            }));
            navigate('/login');
        } catch (error: any) {
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

    const handlePostClick = (postId: any, userId: any, postTitle: any, postContent: any, postUsername: any) => {
        setSelectedPost(postId);
        setPostUserId(userId);
        setSelectedPostTitle(postTitle);
        setSelectedPostContent(postContent);
        setSelectedPostUsername(postUsername);
    };

    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await axios.get('/post/getPosts', {
                    headers: {
                        "Authorization": `Bearer ${ accessToken }`
                    }
                });
                
                dispatch(authActions.changeLoggedInUser({
                    ...loggedInUserState,
                    allPosts: res.data.allPosts,
                }));
            } catch (error: any) {
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
        if (selectedOption === "") {
            getPosts();
            setSelectedOption("allPosts");
        }
        if (selectedOption === "allPosts") {
            getPosts();
        } else if (selectedOption === "userPosts") {
            getPosts();
            const temp = allPosts.filter((post: any) => {
                return post.user._id === loggedInUserId
            });
            setUserPosts(temp);
        }
    }, [ selectedOption ]);

    return (
        <div className="home">
            <div className="side-menu">
                <div>
                    <div className={ selectedOption === "allPosts" ? `menu-selected menu-div` : `menu-div` } onClick={() => {
                        setSelectedOption('allPosts');
                        setSelectedPost("");
                        setUserPosts([]);
                        setHidePostsPanel(false);
                    }}>
                        <HomeIcon fontSize="small" />
                    </div>
                    <div className={ selectedOption === "userPosts" ? `menu-selected menu-div` : `menu-div` } onClick={() => {
                        setSelectedOption('userPosts');
                        setSelectedPost("");
                        setHidePostsPanel(false);
                    }}>
                        <PersonIcon fontSize="small" />
                    </div>
                    <div className={ selectedOption === "createPost" ? `menu-selected menu-div` : `menu-div` } onClick={() => {
                        setSelectedOption('createPost');
                        setUserPosts([]);
                        setSelectedPost("");
                    }}>
                        <CreateIcon fontSize="small" />
                    </div>
                </div>
                <div>
                    <div className="logout-div" onClick={handleLogout}>
                        <LogoutIcon fontSize="small" />
                    </div>
                </div>
            </div>
            <div className="main-content">
                { selectedOption === "allPosts" &&
                    <div className="all-posts">
                        { !hidePostsPanel && <div className="all-posts-div">
                            <div className="all-posts-heading">
                                Blogs
                            </div>
                            { allPosts.length > 0 ? <ul className="posts-list">
                                { allPosts.map((post: any) => {
                                    return <li className={ selectedPost === post._id ? `post-all post-selected-style` : "post-all" } key={ post._id } value={ post._id } onClick={ () => handlePostClick(post._id, post.user._id, post.postTitle, post.postContent, post.user.username) }>
                                        <div>
                                            { post.postTitle }
                                        </div>
                                        <div className="post-username">
                                            { post.user.username }
                                        </div>
                                    </li>
                                }) }
                            </ul> : <div className="no-blogs-found">No Blogs Found</div> }
                        </div> }
                        { selectedPost !== "" ?
                            <div className="selected-post">
                                <ViewPost
                                    setSelectedOption={ setSelectedOption }
                                    setHidePostsPanel={ setHidePostsPanel }
                                    setSelectedPost={ setSelectedPost }
                                    selectedPostId={ selectedPost }
                                    postUserId={ postUserId }
                                    selectedPostTitle={ selectedPostTitle }
                                    selectedPostContent={ selectedPostContent }
                                    selectedPostUsername={ selectedPostUsername }
                                />
                            </div>
                        : <div className="no-post-selected">{ `No post selected` }</div> }
                    </div>
                }
                { selectedOption === "userPosts" &&
                    <div className="user-posts">
                        { !hidePostsPanel && <div className="user-posts-div">
                            <div className="user-posts-heading">
                                Your Blogs
                            </div>
                            { userPosts.length > 0 ? <ul className="posts-list">
                                { userPosts.map((post: any) => (
                                    <li className={ selectedPost === post._id ? `post post-selected-style` : "post" } key={ post._id } value={ post._id } onClick={ () => handlePostClick(post._id, post.user._id, post.postTitle, post.postContent, post.user.username) } >
                                        { post.postTitle }
                                    </li>
                                )) }
                            </ul> : <div className="no-blogs-found"><p>No Blogs Posted</p></div> }
                        </div> }
                        { selectedPost !== "" ?
                            <div className="selected-post">
                                <ViewPost
                                    setSelectedOption={ setSelectedOption }
                                    setHidePostsPanel={ setHidePostsPanel }
                                    setSelectedPost={ setSelectedPost }
                                    selectedPostId={ selectedPost }
                                    postUserId={ postUserId }
                                    selectedPostTitle={ selectedPostTitle }
                                    selectedPostContent={ selectedPostContent }
                                    selectedPostUsername={ selectedPostUsername }
                                />
                            </div>
                        : <div className="no-post-selected">{ `No post selected` }</div> }
                    </div>
                }
                { selectedOption === "createPost" &&
                    <div className="create-post">
                        <CreatePost setSelectedOption={ setSelectedOption } />
                    </div>
                }
            </div>
        </div>
    );
};


export default Home;