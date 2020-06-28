package tk.tkr_net.fp_fukuoka.controller;

import java.time.LocalDate;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import tk.tkr_net.fp_fukuoka.dto.YearMonthDto;
import tk.tkr_net.fp_fukuoka.model.ScheduleRepository;
import tk.tkr_net.fp_fukuoka.service.DemoDataService;
import tk.tkr_net.fp_fukuoka.service.ScheduleCalendarDtoBuilder;

@Controller
@RequestMapping("")
public class MonthlyController {
    private final ScheduleRepository scheduleRepository;
    private final DemoDataService demoDataService;

    public MonthlyController(ScheduleRepository scheduleRepository, DemoDataService demoDataService) {
        this.scheduleRepository = scheduleRepository;
        this.demoDataService = demoDataService;
    }

    /**
     * 月のカレンダーを表示する
     */
    @GetMapping("/{year:\\d{4}}/{month:\\d{1,2}}")
    public String monthCalendar(Model model, @PathVariable("year") Integer year, @PathVariable("month") Integer month) {

        // DBからデータ取得
        var from = LocalDate.of(year, month, 1);
        var to = from.plusMonths(1);
        var schedules = scheduleRepository.findBetween(from, to);

        // データを組み合わせて表示用DTOを構築
        var dto = ScheduleCalendarDtoBuilder.build(year, month, schedules);
        model.addAttribute("dto", dto);

        // 今月、先月、来月
        var thisMonth = LocalDate.of(year, month, 1);
        model.addAttribute("thisMonth", new YearMonthDto(thisMonth.getYear(), thisMonth.getMonthValue()));
        var prevMonth = thisMonth.minusMonths(1);
        model.addAttribute("prevMonth", new YearMonthDto(prevMonth.getYear(), prevMonth.getMonthValue()));
        var nextMonth = thisMonth.plusMonths(1);
        model.addAttribute("nextMonth", new YearMonthDto(nextMonth.getYear(), nextMonth.getMonthValue()));
        return "/monthly";
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
        return "redirect:/" + year + "/" + month;
    }

    /**
     * デモ用。scheduleRepositoryが空かどうかを調べる
     */
    @ModelAttribute("needsDemoDataGeneration")
    boolean needsDemoDataGeneration() {
        return demoDataService.isDataEmpty();
    }

    /**
     * デモ用。ランダムデータを発生させる
     */
    @GetMapping("demo")
    public String generateDemoData() {
        demoDataService.generateData();
        return "redirect:/";
    }

}