package tk.tkr_net.fp_fukuoka.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.TreeMap;

/**
 * 週を表す行
 */
public class WeekRowDto {
    private final TreeMap<LocalDate, DayCellDto> days = new TreeMap<>();

    /**
     * 日を追加
     */
    public void addDay(DayCellDto c) {
        days.put(c.date, c);
    }

    /**
     * 日リスト
     */
    public List<DayCellDto> getDays() {
        return List.copyOf(days.values());
    }
}