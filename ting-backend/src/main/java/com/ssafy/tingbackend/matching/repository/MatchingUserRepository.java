package com.ssafy.tingbackend.matching.repository;

import com.ssafy.tingbackend.entity.matching.Matching;
import com.ssafy.tingbackend.entity.matching.MatchingUser;
import com.ssafy.tingbackend.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MatchingUserRepository extends JpaRepository<MatchingUser, Long> {

    @Query("SELECT m.user FROM MatchingUser m WHERE m.matching=:matching AND m.user!=:user")
    Optional<User> findFriend(Matching matching, User user);

    @Query("SELECT m FROM MatchingUser m WHERE m.matching=:matching AND m.user!=:user")
    Optional<MatchingUser> findFriendInfo(Matching matching, User user);

    Optional<MatchingUser> findByMatchingAndUser(Matching matching, User user);

}
