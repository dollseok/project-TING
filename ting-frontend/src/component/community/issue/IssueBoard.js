import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./IssueBoard.module.css";
import Sidebar from "../common/Sidebar";
import Pagination from "../common/Pagination";
import tokenHttp from "../../../api/tokenHttp";
import basicHttp from "../../../api/basicHttp";

function IssueBoard() {
  const [issueList, setIssueList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const userdata = useSelector((state) => state.userdataReducer.userdata);

  useEffect(() => {
    getAllIssueData();
  }, [currentPage]);

  const getAllIssueData = async () => {
    try {
      const response = await basicHttp.get("/issue", { params: { pageNo: currentPage } });
      const responseData = response.data.data;

      if (responseData.issueBoardList) {
        setIssueList(responseData.issueBoardList);
        setTotalPages(responseData.totalPages);
      }
    } catch (error) {
      console.error("Error fetching issue data:", error);
    }
  };

  const handleLinkClick = (issueId, event) => {
    event.preventDefault();
    if (userdata) {
      navigate(`/community/issue/detail/${issueId}`);
    } else {
      alert("로그인이 필요합니다.");
    }
  };

  const handleCreateClick = () => {
    if (userdata) {
      navigate("/community/issue/create");
    } else {
      alert("로그인이 필요합니다.");
    }
  };


  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const showKebab = (nickname) => {
    return userdata && userdata.nickname === nickname;
  };

//  글 수정은 불가
  const handleDelete = async (issueId) => {
    try {
      await tokenHttp.delete(`issue/${issueId}`);
      console.log("delete성공");
      await getAllIssueData();
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  return (
    <div className={styles.issueBoardContainer}>
      <Sidebar />
      <button className={styles.createButton} onClick={handleCreateClick}>
        글 작성하기
      </button>

      <div className={styles.cardList}>
        {issueList.map((issue) => (
          <div key={issue.issueId} className={styles.card}>
            <span className={styles.link} onClick={(event) => handleLinkClick(issue.issueId, event)}>
              {issue.title}
            </span>
            <div className={styles.cardFooter}>
              <div className={styles.cardVotes}>
                <div className={styles.agree}>
                  <span>{issue.agree_title}</span>
                  <span>{issue.agree_count}</span>
                </div>
                <div className={styles.oppose}>
                  <span>{issue.oppose_title}</span>
                  <span>{issue.oppose_count}</span>
                </div>
              </div>
              {showKebab(issue.nickname) && (
                <div className={styles.dropdownContainer}>
                  <img src="/img/kebab.png" alt="kebab" className={styles.dropdownKebab} />
                  <div className={styles.dropdownContent}>
                    <span onClick={() => handleDelete(issue.issueId)}>Delete</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}

export default IssueBoard;
