import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';

import { useState, useEffect } from 'react';

const DUMMY_TIMES = [
  { day: 'Monday', from: '10:30am', to: '12pm' },
  { day: 'Monday', from: '3pm', to: '4pm' },
  { day: 'Wednesday', from: '9:45am', to: '10:45pm' },
  { day: 'Thursday', from: '1pm', to: '2pm' },
  { day: 'Friday', from: '4:15pm', to: '5:30pm' },
];

const DUMMY_DATA: {
  [key: string]: {
    [key: string]: { day: string; from: string; to: string }[];
  };
} = {
  'CS 1336': {
    'Shyam Karrah': DUMMY_TIMES,
    'Srimathi Srinvasan': DUMMY_TIMES,
    'Laurie Tompson': DUMMY_TIMES,
  },
  'CS 1337': {
    'Scott Dollinger': DUMMY_TIMES,
    'Miguel Razo Razo': DUMMY_TIMES,
    'Srimathi Srinivasan': DUMMY_TIMES,
    'Khiem Le': DUMMY_TIMES,
    'Jeyakesavan Veerasamy': DUMMY_TIMES,
    'Jason Smith': DUMMY_TIMES,
    'Doug DeGroot': DUMMY_TIMES,
  },
};

const DUMMY_COURSES = Object.keys(DUMMY_DATA).map((name) => ({ label: name }));

const theme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiAutocomplete-endAdornment .MuiButtonBase-root .MuiSvgIcon-root':
            {
              color: '#f5f5f5',
            },
        },
        input: {
          color: '#f5f5f5',
        },
        paper: {
          backgroundColor: '#404040',
        },
        option: {
          color: '#f5f5f5',
        },
        noOptions: {
          color: '#f5f5f5',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&:disabled': {
            backgroundColor: '#404040',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: '#f5f5f5',
          },
          '& .MuiFormLabel-root': {
            color: '#f5f5f5',
          },
          // Normal/multiline TextField styles
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#404040',
          },
          '& .MuiOutlinedInput-root:hover fieldset': {
            borderColor: '#f5f5f5',
          },
          '& .MuiOutlinedInput-root.Mui-focused fieldset': {
            borderColor: '#f5f5f5',
          },
        },
      },
    },
  },
});

const getOptionEquality = (
  option: { label: string },
  value: { label: string }
) => option.label === value.label;

const MeetingScheduler = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedTutor, setSelectedTutor] = useState<string>('');
  const [selectedTimeslot, setSelectedTimeslot] = useState<string>('');
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [meetingDesc, setMeetingDesc] = useState<string>('');

  const availableTutors = selectedCourse
    ? Object.keys(DUMMY_DATA[selectedCourse]).map((name) => ({
        label: name,
      }))
    : [];

  const availableTimeslots =
    selectedCourse &&
    selectedTutor &&
    selectedTutor in DUMMY_DATA[selectedCourse]
      ? DUMMY_DATA[selectedCourse][selectedTutor].map((timeslot) => ({
          label: `${timeslot.day} ${timeslot.from} - ${timeslot.to}`,
        }))
      : [];

  const courseSelectChangeHandler = (
    e: React.FormEvent<EventTarget>,
    value: string,
    reason: string
  ) => {
    if (reason === 'clear') {
      setSelectedCourse('');
      setSelectedTutor('');
      setSelectedTimeslot('');
      return;
    }
    if (reason === 'input') {
      return;
    }
    setSelectedCourse(value);
  };

  const tutorSelectChangeHandler = (
    e: React.FormEvent<EventTarget>,
    value: string,
    reason: string
  ) => {
    if (reason === 'clear') {
      setSelectedTutor('');
      setSelectedTimeslot('');
      return;
    }
    if (reason === 'input') {
      return;
    }
    setSelectedTutor(value);
  };

  const timeslotSelectChangeHandler = (
    e: React.FormEvent<EventTarget>,
    value: string,
    reason: string
  ) => {
    if (reason === 'input') {
      return;
    }
    setSelectedTimeslot(value);
  };

  useEffect(() => {
    if (selectedCourse && selectedTutor) {
      if (!(selectedTutor in DUMMY_DATA[selectedCourse])) {
        setSelectedTutor('');
        setSelectedTimeslot('');
      } else if (
        selectedTimeslot &&
        !DUMMY_DATA[selectedCourse][selectedTutor].find(
          (timeslot: { day: string; from: string; to: string }) =>
            `${timeslot.day} ${timeslot.from} - ${timeslot.to}` ===
            selectedTimeslot
        )
      ) {
        setSelectedTimeslot('');
      }
    }
  }, [selectedCourse, selectedTutor, selectedTimeslot]);

  const submitHandler = () => {
    return;
  };

  return (
    <Box className='grid place-content-center bg-[#191919]'>
      <Stack
        className='my-24'
        spacing={16}>
        <ThemeProvider theme={theme}>
          <Stack spacing={6}>
            <Typography
              variant='h4'
              align='center'>
              Schedule a new appointment
            </Typography>
            <Autocomplete
              id='course-select'
              options={DUMMY_COURSES}
              disablePortal
              value={selectedCourse ? { label: selectedCourse } : null}
              onInputChange={courseSelectChangeHandler}
              isOptionEqualToValue={getOptionEquality}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Course'
                />
              )}
            />
            <Autocomplete
              id='instructor-select'
              options={availableTutors}
              disablePortal
              value={selectedTutor ? { label: selectedTutor } : null}
              onInputChange={tutorSelectChangeHandler}
              isOptionEqualToValue={getOptionEquality}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Tutor'
                />
              )}
            />
          </Stack>
          <Stack spacing={6}>
            <Typography
              variant='h4'
              align='center'>
              Select an available timeslot
            </Typography>
            <Autocomplete
              id='timeslot-select'
              options={availableTimeslots}
              disablePortal
              value={selectedTimeslot ? { label: selectedTimeslot } : null}
              onInputChange={timeslotSelectChangeHandler}
              isOptionEqualToValue={getOptionEquality}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Timeslot'
                />
              )}
            />
          </Stack>
          <Stack spacing={6}>
            <Typography
              variant='h4'
              align='center'>
              Fill out details
            </Typography>
            <TextField
              id='meeting-title-field'
              label='Meeting title'
              required
              value={meetingTitle}
              onChange={(e) => {
                setMeetingTitle(e.target.value);
              }}
            />
            <TextField
              id='meeting-desc-field'
              label='Meeting description'
              multiline
              rows={3}
              value={meetingDesc}
              onChange={(e) => {
                setMeetingDesc(e.target.value);
              }}
            />
          </Stack>
          <Button
            variant='contained'
            color='success'
            size='large'
            className='mx-auto'
            disabled={
              !selectedCourse ||
              !selectedTutor ||
              !selectedTimeslot ||
              !meetingTitle
            }
            onClick={submitHandler}>
            Submit
          </Button>
        </ThemeProvider>
      </Stack>
    </Box>
  );
};

export default MeetingScheduler;
