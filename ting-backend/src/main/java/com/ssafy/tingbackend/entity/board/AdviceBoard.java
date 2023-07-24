package com.ssafy.tingbackend.entity.board;

import com.ssafy.tingbackend.entity.common.BaseTimeEntity;
import com.ssafy.tingbackend.entity.user.User;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(of = {"user", "title", "content"})
@DynamicInsert
public class AdviceBoard extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String title;
    private String content;
    @ColumnDefault("0")
    private Long hit;

    @OneToMany(mappedBy = "adviceBoard")
    private List<Comment> comments;
}
