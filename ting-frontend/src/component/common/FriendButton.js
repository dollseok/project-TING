import { useState, useRef, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import tokenHttp from "../../api/tokenHttp";
import { getCurrentUserdata } from "../../redux/userdata";

import styles from "./FriendButton.module.css";
import Friend from "../friend/Friend";

import { Link, useNavigate } from "react-router-dom";
import FriendProfile from "../friend/FriendProfile";
import useMessageStore from "../friend/useMessageStore";


const FriendButton = ({ toggleWheelHandler }) => {
  let userData = useSelector((state) => state.userdataReducer.userdata);
  const navigate = useNavigate();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [show, setShow] = useState(false);
  const [profileShow, setProfileShow] = useState(false);
  const [icon, setIcon] = useState("");
  const [temperature, setTemperature] = useState("");
  // const [showProfile, setShowProfile] = useState(false);
  const friendId = useSelector((state) => state.friendReducer.friendId);
  const messageStore = useMessageStore();
  const { messageLogs } = messageStore;
  const [totalUnread, setTotalUnread] = useState(0);
  const [friendUnread, setFriendUnread] = useState(0);
  const [curChattingId, setCurChattingId] = useState(0);

  // let isClosed = true;

  const changeIsClosed = () => {
    // alert(isClosed);
    // isClosed = !isClosed;
    // console.log(isClosed);
    if (show) {
      setShow(false);
      setProfileShow(false);
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo({
        left: 0,
        top: parseInt(scrollY || "0", 10) * -1,
        behavior: "instant",
      });

      toggleWheelHandler();
    } else {
      setShow(true);
      document.body.style.cssText = `
      position: fixed; 
      top: -${window.scrollY}px;
      overflow: scroll;
      width: 100%;`;

      toggleWheelHandler();
    }
  };

  const closeModal = (data) => {
    setIsModalOpened(data);
    changeIsClosed();
  };

  const openProfile = (data) => {
    setProfileShow(data);
  };

  const getIcon = () => {
    tokenHttp
      .get("/user/skin")
      .then((response) => {
        if (response.data.code == 200) {
          console.log(response.data.data);
          console.log(response.data.data.itemType);
          setIcon(getName(response.data.data.itemType));
          console.log(icon);
        } else {
          console.log("아이콘 불러오기 실패");
        }
      })
      .catch(() => {
        console.log("아이콘 불러오기 실패");
      });
  };

  // 친구 목록 불러오기
  const friendListAxios = () => {
    tokenHttp
      .get("/friend")
      .then((response) => {
        // 불러오기 성공 시 friendList에 친구목록 저장
        if (response.data.code === 200) {
          console.log("친구 목록 불러오기 성공");
          // setFriendList(response.data.data); // 친구 리스트 state에 저장
          console.log(response.data.data);
          let num = 0;
          response.data.data.map((data) => {
            num += data.unread;
          })
          setTotalUnread(totalUnread + num);
          // setInitialUnread(num);
        } else if (response.data.code === 400) {
          console.log("실패");
        }
      })
      .catch(() => console.log("실패"));
  };

  const getName = (category) => {
    if (category == "SKIN_3") return "bowl";
    else if (category == "SKIN_5") return "tank";
    else if (category == "SKIN_10") return "aquarium";
    else return "glass";
  };

  const getTemperature = (data) => {
    setTemperature(data);
  }

  const getFriendUnread = (data) => {
    setFriendUnread(data);
  }

  const getCurChatting = (data) => {
    setCurChattingId(data);
  }

  useEffect(() => {
    friendListAxios();
  }, [])

  useEffect(() => {
    getIcon();
  }, [icon]);

  useEffect(() => {
    setTotalUnread(totalUnread - friendUnread);
  }, [friendUnread])

  useEffect(() => {
    if(messageLogs) {
      messageLogs.map((data) => {
        if(data.userId != userData.userId) {
          if(curChattingId == 0 || curChattingId != data.chattingId) {
            setTotalUnread(totalUnread+1);
          }
        }
      })
    }
  }, [messageLogs])

  return (
    <div className={styles.friendContainer}>
      <button className={styles.button} onClick={() => changeIsClosed()}>
        {
          totalUnread == 0 ? "" : 
          <div className={styles.totalUnread}>{totalUnread}</div>
        }
        <img
          src={process.env.PUBLIC_URL + `/img/friend_${icon}.png`}
          className={styles.coinImage}
          alt="icon"
        />
      </button>
      <div>
        {/* <div className={styles.profileContainer}></div> */}
        {show && (
          <div className={styles.chatContainer}>
            <Friend onSearch={closeModal} onSearch2={openProfile} temperature={getTemperature} friendUnread={getFriendUnread} curChattingObj={getCurChatting}/>
          </div>
        )}
        <div>
          {profileShow && friendId && (
            <div className={styles.profileContainer}>
              <FriendProfile friendId={friendId} temperature={temperature} />
            </div>
          )}
        </div>
        {/* <div className={isClosed? styles.hide : styles.chatConainer}>
        <Friend />
      </div> */}
      </div>
    </div>
  );
};

export default FriendButton;
