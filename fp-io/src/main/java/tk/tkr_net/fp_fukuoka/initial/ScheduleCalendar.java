package tk.tkr_net.fp_fukuoka.initial;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.TreeMap;

public class ScheduleCalendar {
    /**
     * 週を表す行
     */
    public static class WeekRow {
        private final TreeMap<LocalDate, DayCell> days = new TreeMap<>();
        private void add(DayCell c) {
            days.put(c.date, c);
        }
        public Collection<DayCell> getDays() {
            return days.values();
        }
    }

    /**
     * 日を表すセル
     */
    public static class DayCell {
        private final ArrayList<Schedule> schedules = new ArrayList<>();
        public final LocalDate date;
        private DayCell(LocalDate date) {
            this.date = date;
        }
        private void add(Schedule s) {
            schedules.add(s);
        }
        public Collection<Schedule> getSchedules() {
            return schedules;
        }
        public int getDayOfMonth() {
            return date.getDayOfMonth();
        }
    }

    private final ArrayList<WeekRow> weeks = new ArrayList<>();
    private final HashMap<LocalDate, DayCell> days = new HashMap<>();

    public ScheduleCalendar(int year, int month) {
        // 1日
        var d1 = LocalDate.of(year, month, 1);
        // 最初の週の日曜日まで戻る
        var d = d1;
        while (d.getDayOfWeek() != DayOfWeek.SUNDAY) {
            d = d.minusDays(1);
        }
        var guard = d1.plusMonths(1);
        // 週ループ
        while (d.isBefore(guard)) {
            var row = new WeekRow();
            for (var i = 0; i < 7; i++, d = d.plusDays(1)) {
                var cell = new DayCell(d);
                row.add(cell);
                days.put(d, cell);
            }
            weeks.add(row);
        }
    }

    public void add(Schedule s) {
        var cell = days.get(s.getDate());
        if (cell != null) {
            cell.add(s);
        }
    }

    public List<WeekRow> getWeeks() {
        return weeks;
    }
}