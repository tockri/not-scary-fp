package tk.tkr_net.fp_fukuoka.initial;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Schedule {
    @Id
    @GeneratedValue
    private Integer id;

    private LocalDate date;

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