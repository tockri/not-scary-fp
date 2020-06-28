package tk.tkr_net.fp_fukuoka.model;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * スケジュール
 */
@Entity
public class Schedule {
    @Id
    @GeneratedValue
    private Integer id;

    /**
     * 日付
     */
    private LocalDate date;

    /**
     * タイトル
     */
    private String title;

    protected Schedule() {}

    public Schedule(LocalDate date, String title) {
        this.date = date;
        this.title = title;
    }

    public Integer getId() {
        return id;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getTitle() {
        return title;
    }
}