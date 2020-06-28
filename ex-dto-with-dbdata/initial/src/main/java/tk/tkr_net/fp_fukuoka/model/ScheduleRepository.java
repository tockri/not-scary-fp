package tk.tkr_net.fp_fukuoka.model;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {

    /**
     * 期間内のスケジュール一覧
     */
    @Query("select s from Schedule s where s.date >= :from and s.date < :to order by s.date")
    List<Schedule> findBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);

}