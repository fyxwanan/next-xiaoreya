"use client"

import React, { useState, useRef, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import { formatDate, CalendarApi } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { LeftOutlined, RightOutlined, PlusOutlined, CarryOutOutlined, ScheduleOutlined } from "@ant-design/icons"
import { Radio, Dropdown } from "antd";
import type { RadioChangeEvent, MenuProps } from "antd";
import { INITIAL_EVENTS, createEventId } from "./event-utils"
import zhCnLocale from "@fullcalendar/core/locales/zh-cn";
import CreateActions from "./components/CreateActions";
import CalendarStore from "./CalendarStore";
import "./calendar.css";


const { Group: RadioGroup } = Radio;

export default function WorkCalendar() {
    const calendarRef = useRef<FullCalendar | null>(null);
    const [view, setView] = useState<"dayGridMonth" | "dayGridWeek" | "dayGridDay">("dayGridMonth");
    const [currentMonth, setCurrentMonth] = useState<string>("");
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        CalendarStore.instance.getEventList().then((res) => {
            setEvents(res)
        })
    }, [])


    useEffect(() => {
        getCurrentMouth()
    }, [calendarRef?.current]);

    // 获取当前日期
    const getCurrentMouth = () => {
        if (calendarRef.current) {
            const calendarApi: CalendarApi = calendarRef.current.getApi();
            const date = calendarApi.getDate();
            const formartDate = formatDate(date, { year: "numeric", month: "long", locale: "zh-cn" });
            setCurrentMonth(formartDate);
        }
    };

    // 跳转到上一天
    const goToPreviousDay = () => {
        if (calendarRef.current) {
            const calendarApi: CalendarApi = calendarRef.current.getApi();
            calendarApi.prev(); // 跳转到上一天
            getCurrentMouth()
        }
    };

    // 跳转到下一天
    const goToNextDay = () => {
        if (calendarRef.current) {
            const calendarApi: CalendarApi = calendarRef.current.getApi();
            calendarApi.next(); // 跳转到下一天
            getCurrentMouth()
        }
    };

    // 切换到日视图
    const changeToDayView = () => {
        if (calendarRef.current) {
            const calendarApi: CalendarApi = calendarRef.current.getApi();
            calendarApi.changeView("dayGridDay"); // 切换为日视图
            getCurrentMouth()
        }
    };

    // 切换到周视图
    const changeToWeekView = () => {
        if (calendarRef.current) {
            const calendarApi: CalendarApi = calendarRef.current.getApi();
            calendarApi.changeView("dayGridWeek"); // 切换为周视图
            getCurrentMouth()
        }
    };

    // 切换到月视图
    const changeToMonthView = () => {
        if (calendarRef.current) {
            const calendarApi: CalendarApi = calendarRef.current.getApi();
            calendarApi.changeView("dayGridMonth"); // 切换为月视图
            getCurrentMouth()
        }
    };

    // 回到今天
    const goToToday = () => {
        if (calendarRef.current) {
            const calendarApi: CalendarApi = calendarRef.current.getApi();
            calendarApi.today(); // 回到今天
            getCurrentMouth()
        }
    };

    const handleChangeView = ({ target: { value } }: RadioChangeEvent) => {
        if (value === "dayGridMonth") {
            changeToMonthView();
        } else if (value === "dayGridWeek") {
            changeToWeekView();
        } else if (value === "dayGridDay") {
            changeToDayView();
        }
        setView(value);
    };

    return (
        <div className="h-full">
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-[12px]">
                    <div className="font-medium text-base">{currentMonth}</div>
                    <div className="flex items-center cursor-pointer border rounded-md">
                        <div className="size-7 flex items-center justify-center hover:text-[var(--primary-color)] border-r" onClick={() => goToPreviousDay()}><LeftOutlined /></div>
                        <div className="w-12 hover:text-[var(--primary-color)] text-center" onClick={() => goToToday()}>今天</div>
                        <div className="size-7 flex items-center justify-center hover:text-[var(--primary-color)] border-l" onClick={() => goToNextDay()}> <RightOutlined /></div>
                    </div>
                    <RadioGroup
                        options={[
                            { label: "月", value: "dayGridMonth" },
                            { label: "周", value: "dayGridWeek" },
                            { label: "日", value: "dayGridDay" },
                        ]}
                        onChange={handleChangeView}
                        value={view}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </div>
                <div className="flex items-center justify-end">
                    <CreateActions />
                </div>
            </div>
            <div style={{ height: "calc(100% - 48px)" }} className="plan-work-calendar">
                <FullCalendar
                    ref={calendarRef}
                    height={"100%"}
                    contentHeight={"100%"}
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                    headerToolbar={false}
                    initialView={view}
                    fixedWeekCount={false}
                    // editable={true}
                    // selectable={true}
                    // selectMirror={true}
                    // dayMaxEvents={true}
                    weekends={true}
                    events={events}
                    firstDay={1}
                    locale={zhCnLocale}
                // select={handleDateSelect}
                // eventContent={renderEventContent} // custom render function
                // eventClick={handleEventClick}
                // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                />
            </div>
        </div>
    )
}