package tk.tkr_net.fp_fukuoka.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import tk.tkr_net.fp_fukuoka.model.Schedule;
import tk.tkr_net.fp_fukuoka.model.ScheduleRepository;

@Service
public class DemoDataService {
    private final ScheduleRepository scheduleRepository;

    public DemoDataService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public boolean isDataEmpty() {
        long count = scheduleRepository.count();
        return count == 0L;
    }

    public void generateData() {
        if (isDataEmpty()) {
            for (int i = 0; i < 100; i++) {
                var date = LocalDate.now().minusDays((long) (Math.random() * 100));
                var title = "スケジュール" + ((int) (Math.random() * 100));
                var s = new Schedule(date, title);
                scheduleRepository.save(s);
            }
        }
    }

}