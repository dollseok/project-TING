import { useDispatch, useSelector } from "react-redux";
import styles from "./SignupCommon.module.css";
import { useEffect } from "react";
import { completeSignupStep } from "../../redux/signup";
import { useLocation, useNavigate } from "react-router";
import basicHttp from "../../api/basicHttp";

function SignupComplete() {
  const navigate = useNavigate();
  const signupReducer = useSelector((state) => state.signupReducer);

  const completeSignup = (moveTo) => {
    basicHttp.post('/user/signup', signupReducer).then((response) => {
      if (response.data.code === 200) {
        alert("회원가입이 완료되었습니다.");
        navigate(moveTo);
      }
      else if (response.data.code === 400) {
        alert("회원 가입 실패\n정확한 정보를 입력해주세요.");
      }
    })
    .catch(() => alert("회원가입 실패"))
  }


  return (
    <div>
      <div className={styles.completeContainer}>
        {/* <h3>회원가입이 완료되었습니다</h3> */}
        <p className={styles.completeParagraph}>
          { signupReducer.name }님에 대해 더 알려주시면 <br /> 저희가 최선의 소개팅 상대를 찾아드려요.
        </p>
        <div className={styles.selectContainer}>
          <button className={`${styles.btn} ${styles.signupComplete}`} 
          onClick={() => navigate("/signup/select")}>선택정보 입력하기</button>
        </div>
        <br />
          <p className={styles.completeParagraph}>
            선택정보를 입력하지 않아도<br />
            회원가입을 완료할 수 있어요 :)
          </p>
          <div className={styles.selectContainer}>
          <button 
            className={`${styles.btn} ${styles.signupComplete}`} 
            onClick={() => {
              // dispatch(completeSignupStep()); // signupReducer내용 초기화
              completeSignup("/login")
            }}>회원가입 완료하기</button>
          </div>
      </div>
    </div>
  );
}

export default SignupComplete;
