package tk.tkr_net.fp_fukuoka.initial;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.TreeMap;

/**
 * カレンダーにスケジュールを表示するためのモデル
 */
public class ScheduleCalendarDto {
    /**
     * 週を表す行
     */
    public static class WeekRow {
        private final TreeMap<LocalDate, DayCell> days = new TreeMap<>();
        /**
         * 日を追加
         */
        private void add(DayCell c) {
            days.put(c.date, c);
        }
        /**
         * 日リスト
         */
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
        public final boolean inRange;
        private DayCell(LocalDate date, boolean inRange) {
            this.date = date;
            this.inRange = inRange;
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
        public String getCssClass() {
            return date.getDayOfWeek().name().toLowerCase()
                + (inRange ? "" : " out-month");
        }
    }

    private final ArrayList<WeekRow> weeks = new ArrayList<>();
    private final HashMap<LocalDate, DayCell> days = new HashMap<>();

    /**
     * １か月分の日曜始まりのカレンダーを生成する
     */
    public ScheduleCalendarDto(int year, int month) {
        // 今月1日
        var d1 = LocalDate.of(year, month, 1);
        // 日曜日まで戻る
        var d = d1;
        while (d.getDayOfWeek() != DayOfWeek.SUNDAY) {
            d = d.minusDays(1);
        }
        // 来月になるまでループ
        var guard = d1.plusMonths(1);
        while (d.isBefore(guard)) {
            var row = new WeekRow();
            for (var i = 0; i < 7; i++, d = d.plusDays(1)) {
                var cell = new DayCell(d, d.getMonthValue() == month);
                row.add(cell);
                days.put(d, cell);
            }
            weeks.add(row);
        }
    }

    /**
     * スケジュールを追加する
     */
    public void add(Schedule s) {
        var cell = days.get(s.getDate());
        if (cell != null) {
            cell.add(s);
        }
    }

    /**
     * 週リスト
     */
    public List<WeekRow> getWeeks() {
        return weeks;
    }
}