import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define TypeScript types for the mock API data structure
interface InsightSummary {
  total_queries: number;
  successful_queries: number;
  failed_queries: number;
  average_response_time: number;
}

interface CategoryDistribution {
  [category: string]: number;
}

interface ResponseTime {
  date?: string;
  week?: string;
  average_time: number;
}

interface UserSatisfactionRating {
  rating: number;
  count: number;
}

interface UsageStatisticsByPlatform {
  iOS: number;
  Android: number;
  Web: number;
}

interface UsageStatisticsByCountry {
  [country: string]: number;
}

interface MockApiData {
  insight_summary: InsightSummary;
  category_distribution: CategoryDistribution;
  response_times: {
    day_wise: ResponseTime[];
    week_wise: ResponseTime[];
  };
  user_satisfaction: {
    ratings: UserSatisfactionRating[];
  };
  usage_statistics: {
    by_platform: UsageStatisticsByPlatform;
    by_country: UsageStatisticsByCountry;
  };
}

// Define the state type
interface ChartDataState {
  data: MockApiData | null;
  loading: boolean;
  error: string | null;
}

// Mock API data
const mockApiData: MockApiData = {
  insight_summary: {
    total_queries: 1500,
    successful_queries: 1350,
    failed_queries: 150,
    average_response_time: 0.45,
  },
  category_distribution: {
    small_talk: 300,
    technical_support: 450,
    sales_inquiries: 350,
    customer_service: 400,
  },
  response_times: {
    day_wise: [
      { date: '2023-05-01', average_time: 0.4 },
      { date: '2023-05-02', average_time: 0.42 },
      { date: '2023-05-03', average_time: 0.35 },
      { date: '2023-05-04', average_time: 0.5 },
      { date: '2023-05-05', average_time: 0.47 },
    ],
    week_wise: [
      { week: '18', average_time: 0.45 },
      { week: '19', average_time: 0.43 },
      { week: '20', average_time: 0.5 },
      { week: '21', average_time: 0.46 },
      { week: '22', average_time: 0.41 },
    ],
  },
  user_satisfaction: {
    ratings: [
      { rating: 1, count: 15 },
      { rating: 2, count: 35 },
      { rating: 3, count: 200 },
      { rating: 4, count: 500 },
      { rating: 5, count: 600 },
    ],
  },
  usage_statistics: {
    by_platform: {
      iOS: 600,
      Android: 700,
      Web: 200,
    },
    by_country: {
      USA: 800,
      India: 250,
      Germany: 150,
      Japan: 100,
      Brazil: 200,
    },
  },
};

export const fetchChartData = createAsyncThunk<MockApiData>(
  'chartData/fetchChartData',
  async () => {
    return new Promise<MockApiData>((resolve) => {
      setTimeout(() => {
        resolve(mockApiData); 
      }, 1000);
    });
  }
);


// Initial state with type definition
const initialState: ChartDataState = {
  data: null,
  loading: false,
  error: null,
};

// Redux slice
const chartDataSlice = createSlice({
  name: 'chartData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChartData.fulfilled, (state, action: PayloadAction<MockApiData>) => {
        state.loading = false;
        state.data = action.payload; // Ensure this is correct
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default chartDataSlice.reducer;
