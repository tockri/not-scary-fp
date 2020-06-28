package tk.tkr_net.fp_fukuoka.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import tk.tkr_net.fp_fukuoka.dto.DayCellDto;
import tk.tkr_net.fp_fukuoka.dto.ScheduleCalendarDto;
import tk.tkr_net.fp_fukuoka.dto.WeekRowDto;
import tk.tkr_net.fp_fukuoka.model.Schedule;

@SpringBootTest
public class ScheduleCalendarDtoBuilderTest {
    @Test
    public void ScheduleCalendarDtoBuilder_build_正常系() {
        var schedules = List.of(
            new Schedule(LocalDate.of(2020, 6, 5), "6月5日-1"),
            new Schedule(LocalDate.of(2020, 6, 30), "6月30日"),
            new Schedule(LocalDate.of(2020, 7, 1), "7月1日"),
            new Schedule(LocalDate.of(2020, 6, 5), "6月5日-2")
        );
        var dto = ScheduleCalendarDtoBuilder.build(2020, 6, schedules);
        assertEquals(5, dto.weeks.size());
        assertEquals(7, dto.weeks.get(0).days.size());
        assertEquals(2, dto.weeks.get(0).days.get(5).schedules.size());
        assertEquals("6月5日-1", dto.weeks.get(0).days.get(5).schedules.get(0));
        assertEquals("6月5日-2", dto.weeks.get(0).days.get(5).schedules.get(1));
        assertEquals("6月30日", dto.weeks.get(4).days.get(2).schedules.get(0));
        assertEquals("7月1日", dto.weeks.get(4).days.get(3).schedules.get(0));
    }

    @Test
    public void DayCellDto＿getter_正常系() {
        var dto = new DayCellDto(LocalDate.of(2020, 6, 10), true, List.of("title1", "title2"));
        assertEquals(10, dto.getDayOfMonth());
        assertTrue(dto.inRange);
        assertEquals("title1", dto.schedules.get(0));
        assertEquals("title2", dto.schedules.get(1));

        var dto2 = new DayCellDto(LocalDate.of(2020, 6, 10), false, List.of());
        assertFalse(dto2.inRange);
    }

    /*
     * プロジェクトでイミュータブルクラスを使う約束がちゃんと出来ているのであれば
     * わざわざテストしなくてもよい
     */
    @Test
    public void DayCellDtoがイミュータブル() {
        var mutableList = new ArrayList<String>();
        mutableList.add("title1");
        mutableList.add("title2");

        var dto = new DayCellDto(LocalDate.of(2020, 6, 10), true,  mutableList);
        assertThrows(UnsupportedOperationException.class, () -> {dto.schedules.add("title3");});
    }

    /*
     * プロジェクトでイミュータブルクラスを使う約束がちゃんと出来ているのであれば
     * わざわざテストしなくてもよい
     */
    @Test
    public void WeekCellDtoがイミュータブル() {
        var mutableList = new ArrayList<DayCellDto>();
        
        var dto = new WeekRowDto(mutableList);
        assertThrows(UnsupportedOperationException.class, () -> {
            dto.days.add(new DayCellDto(LocalDate.of(2020, 6, 1), true, List.of("")));
        });
    }

    /*
     * プロジェクトでイミュータブルクラスを使う約束がちゃんと出来ているのであれば
     * わざわざテストしなくてもよい
     */
    @Test
    public void ScheduleCalendarDtoがイミュータブル() {
        var mutableList = new ArrayList<WeekRowDto>();
        var dto = new ScheduleCalendarDto(mutableList);
        assertThrows(UnsupportedOperationException.class, () -> {
            dto.weeks.add(new WeekRowDto(List.of()));
        });
    }
    
}