package tk.tkr_net.fp_fukuoka.dto;

import java.util.Collections;
import java.util.List;

/**
 * 週を表す行
 * イミュータブル
 */
public class WeekRowDto {
    public final List<DayCellDto> days;

    public WeekRowDto(List<DayCellDto> days) {
        this.days = Collections.unmodifiableList(days);
    }
}