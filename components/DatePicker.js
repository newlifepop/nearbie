import React, { PureComponent } from 'react';
import { View, Text, Picker, Platform, UIManager, LayoutAnimation } from 'react-native';
import _ from 'lodash';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

/*
required: container, date, onChangeDate, borderColor, textColor
optional: none
*/
class DatePicker extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date()
        };

        this.renderYearPicker = this.renderYearPicker.bind(this);
        this.renderMonthPicker = this.renderMonthPicker.bind(this);
        this.renderDayPicker = this.renderDayPicker.bind(this);
        this.onChangeYear = this.onChangeYear.bind(this);
        this.onChangeMonth = this.onChangeMonth.bind(this);
        this.onChangeDay = this.onChangeDay.bind(this);
    }

    componentWillMount() {
        const { date } = this.props;
        this.setState({ selectedDate: date ? date : new Date() });
    }

    componentWillReceiveProps(nextProps) {
        const { date } = nextProps;
        this.setState({ selectedDate: date ? date : new Date() });
    }

    componentWillUpdate() {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        LayoutAnimation.easeInEaseOut();
    }

    renderYearPicker() {
        const currentYear = new Date().getFullYear();

        return _.range(currentYear - 100, currentYear + 1, 1).map((value) => {
            const year = `${value}`;
            return (
                <Picker.Item key={year} label={year} value={year} color={this.props.textColor} />
            );
        });
    }

    renderMonthPicker() {
        return MONTHS.map((value) => {
            return (
                <Picker.Item key={value} label={value} value={value} color={this.props.textColor} />
            );
        });
    }

    renderDayPicker() {
        const { selectedDate } = this.state;
        const numOfDays = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
        
        return _.range(0, numOfDays, 1).map((value) => {
            const day = `${value + 1}`;
            return (
                <Picker.Item key={day} label={day} value={day} color={this.props.textColor} />
            );
        });
    }

    onChangeYear(year) {
        const { selectedDate } = this.state;
        const newDate = new Date(`${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${year}, 00:00:00`);

        this.props.onChangeDate({ selectedDate: newDate > new Date() ? selectedDate : newDate });
    }

    onChangeMonth(month) {
        const { selectedDate } = this.state;
        const newDate = new Date(`${month} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}, 00:00:00`);
        
        this.props.onChangeDate({ selectedDate: newDate > new Date() ? selectedDate : newDate });
    }

    onChangeDay(day) {
        const { selectedDate } = this.state;
        const newDate = new Date(`${MONTHS[selectedDate.getMonth()]} ${day}, ${selectedDate.getFullYear()}, 00:00:00`);
        
        this.props.onChangeDate({ selectedDate: newDate > new Date() ? selectedDate : newDate });
    }

    render() {
        const { selectedDate } = this.state;
        const { borderColor, container, enabled } = this.props;

        const month = selectedDate.getMonth();
        const day = selectedDate.getDate();
        const year = selectedDate.getFullYear();

        return (
            <View style={[container, { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor }]}>
                <Picker
                    selectedValue={`${year}`}
                    onValueChange={this.onChangeYear}
                    style={{ flex: 1 }}
                    enabled={enabled}
                >
                    {this.renderYearPicker()}
                </Picker>
                <Picker
                    selectedValue={MONTHS[month]}
                    onValueChange={this.onChangeMonth}
                    style={{ flex: 1 }}
                    enabled={enabled}
                >
                    {this.renderMonthPicker()}
                </Picker>
                <Picker
                    selectedValue={`${day}`}
                    onValueChange={this.onChangeDay}
                    style={{ flex: 1 }}
                    enabled={enabled}
                >
                    {this.renderDayPicker()}
                </Picker>
            </View>
        );
    }
}

export { DatePicker };