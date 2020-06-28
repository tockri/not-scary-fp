package tk.tkr_net.fp_fukuoka.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import tk.tkr_net.fp_fukuoka.dto.DayCellDto;
import tk.tkr_net.fp_fukuoka.dto.ScheduleCalendarDto;
import tk.tkr_net.fp_fukuoka.dto.WeekRowDto;
import tk.tkr_net.fp_fukuoka.model.Schedule;

public class ScheduleCalendarDtoBuilder {
    /**
     * 画面表示用DTOを構築する
     */
    public static ScheduleCalendarDto build(int year, int month, List<Schedule> schedules) {
        // 今月1日
        var d1 = LocalDate.of(year, month, 1);
        // 日曜日まで戻る
        var d = d1;
        while (d.getDayOfWeek() != DayOfWeek.SUNDAY) {
            d = d.minusDays(1);
        }
        // 来月になるまでループ
        var guard = d1.plusMonths(1);
        var weeks = new ArrayList<WeekRowDto>();
        while (d.isBefore(guard)) {
            var days = new ArrayList<DayCellDto>();
            for (var i = 0; i < 7; i++, d = d.plusDays(1)) { // 日曜～土曜の7日間
                final var date = d;
                var schedulesInDay = schedules.stream()
                        .filter(s -> s.getDate().equals(date))
                        .map(s -> s.getTitle())
                        .collect(Collectors.toList());
                days.add(new DayCellDto(d, d.getMonthValue() == month, schedulesInDay));
            }
            weeks.add(new WeekRowDto(days));
        }
        return new ScheduleCalendarDto(weeks);
    }

    /**
     * 画面表示用DTOを構築する
     * （パフォーマンス改善リファクタリング後）
     */
    public static ScheduleCalendarDto build2(int year, int month, List<Schedule> schedules) {
        // Schedule配列から先にLocalDate -> List<String>のMapを作っておく
        var table = new DateScheduleTable(schedules);

        // 今月1日
        var d1 = LocalDate.of(year, month, 1);
        // 日曜日まで戻る
        var d = d1;
        if (d.getDayOfWeek() != DayOfWeek.SUNDAY) {
            d = d.minusDays(d.getDayOfWeek().getValue());
        }
        // 来月になるまでループ
        var guard = d1.plusMonths(1);
        var weeks = new ArrayList<WeekRowDto>();
        while (d.isBefore(guard)) {
            var days = new ArrayList<DayCellDto>();
            for (var i = 0; i < 7; i++, d = d.plusDays(1)) { // 日曜～土曜の7日間
                days.add(new DayCellDto(d, d.getMonthValue() == month, table.getScheduleTitles(d)));
            }
            weeks.add(new WeekRowDto(days));
        }
        return new ScheduleCalendarDto(weeks);
    }

    /**
     * 日付での検索を高速化するためのTable
     */
    private static class DateScheduleTable {
        private final HashMap<LocalDate, ArrayList<String>> table = new HashMap<>();

        private DateScheduleTable(List<Schedule> schedules) {
            schedules.forEach(sch -> {
                var date = sch.getDate();
                var list = table.get(date);
                if (list == null) {
                    list = new ArrayList<String>();
                    table.put(date, list);
                }
                list.add(sch.getTitle());
            });
        }

        /**
         * DayCellDtoのコンストラクタに渡すStringリスト
         */
        private List<String> getScheduleTitles(LocalDate date) {
            var titles = table.get(date);
            return titles != null ? titles : List.of();
        }
    }
}