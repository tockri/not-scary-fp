package tk.tkr_net.fp_fukuoka.initial;

import java.time.LocalDate;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/initial")
public class MonthlyController {
    /**
     * 年月を表す表示用クラス
     */
    public static class YearMonth {
        public final int year;
        public final int month;

        private YearMonth(int year, int month) {
            this.year = year;
            this.month = month;
        }
        /**
         * YYYY年M月
         */
        public String getLabel() {
            return year + " 年 " + month + " 月";
        }

        /**
         * リンクURL
         */
        public String getLink() {
            return "/initial/monthly/" + year + "/" + month;
        }
    }

    private final ScheduleRepository scheduleRepository;

    public MonthlyController(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    /**
     * 月のカレンダーを表示する
     */
    @GetMapping("monthly/{year:\\d{4}}/{month:\\d{1,2}}")
    public String monthCalendar(Model model, @PathVariable("year") Integer year, @PathVariable("month") Integer month) {
        var from = LocalDate.of(year, month, 1);
        var to = from.plusMonths(1);
        var calendar = new ScheduleCalendar(year, month);
        var list = scheduleRepository.findBetween(from, to);
        list.forEach(calendar::add);
        model.addAttribute("calendar", calendar);
        model.addAttribute("m", new YearMonth(year, month));
        model.addAttribute("next", new YearMonth(to.getYear(), to.getMonthValue()));
        var prev = from.minusMonths(1);
        model.addAttribute("prev", new YearMonth(prev.getYear(), prev.getMonthValue()));
        return "initial/monthly";
    }

    /**
     * 今月にリダイレクト
     */
    @GetMapping("")
    public String root() {
        return redirectToThisMonth();
    }

    /**
     * 今月にリダイレクト
     */
    @GetMapping("/")
    public String redirectToThisMonth() {
        LocalDate today = LocalDate.now();
        int year = today.getYear();
        int month = today.getMonth().getValue();
        return "redirect:/initial/monthly/" + year + "/" + month;
    }

    /**
     * デモ用。scheduleRepositoryが空かどうかを調べる
     */
    @ModelAttribute("needsDemoDataGeneration")
    boolean needsDemoDataGeneration() {
        long count = scheduleRepository.count();
        return count == 0L;
    }

    /**
     * デモ用。ランダムデータを発生させる
     */
    @GetMapping("demo")
    public String generateDemoData() {
        if (needsDemoDataGeneration()) {
            for (int i = 0; i < 100; i++) {
                var date = LocalDate.now().minusDays((long) (Math.random() * 100));
                var title = "スケジュール" + ((int) (Math.random() * 100));
                var s = new Schedule(date, title);
                scheduleRepository.save(s);
            }
        }
        return "redirect:/initial";
    }

}