package com.ssafy.tingbackend.entity.matching;

import com.ssafy.tingbackend.entity.common.BaseCreatedTimeEntity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@ToString(of = {"isSuccess", "matchingUserList"})
@DynamicInsert
public class Matching extends BaseCreatedTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime endTime;
    @ColumnDefault("false")
    private boolean isSuccess;

    @OneToMany(mappedBy = "matching")
    private List<MatchingUser> matchingUserList = new ArrayList<>();
}
