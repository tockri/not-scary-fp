package tk.tkr_net.fp_fukuoka.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import tk.tkr_net.fp_fukuoka.model.Schedule;
import tk.tkr_net.fp_fukuoka.model.ScheduleRepository;

@SpringBootTest
public class ScheduleCalendarServiceTest {
    @Autowired
    private ScheduleRepository scheduleRepository;
    @Autowired
    private ScheduleCalendarService scheduleCalendarService;

    @Test
    public void ScheduleCalendarService_makeDto_正常系() {
        // repositoryにデータを生成
        List.of(
            new Schedule(LocalDate.of(2020, 6, 5), "6月5日-1"),
            new Schedule(LocalDate.of(2020, 6, 30), "6月30日"),
            new Schedule(LocalDate.of(2020, 7, 1), "7月1日"),
            new Schedule(LocalDate.of(2020, 6, 5), "6月5日-2")
        ).forEach(scheduleRepository::save);

        // serviceのテスト
        var dto = scheduleCalendarService.makeDto(2020, 6);
        assertEquals(5, dto.getWeeks().size());
        assertEquals(7, dto.getWeeks().get(0).getDays().size());
        assertEquals(2, dto.getWeeks().get(0).getDays().get(5).getSchedules().size());
        assertEquals("6月5日-1", dto.getWeeks().get(0).getDays().get(5).getSchedules().get(0));
        assertEquals("6月5日-2", dto.getWeeks().get(0).getDays().get(5).getSchedules().get(1));
        assertEquals("6月30日", dto.getWeeks().get(4).getDays().get(2).getSchedules().get(0));

        // repositoryの後始末
        scheduleRepository.deleteAll();
    }

}