import { createTheme } from '@mantine/core';

export const appTheme = createTheme({
  components: {
    Button: {
      styles: () => ({
        root: {
          fontWeight: 300,
        },
      }),
    },
  },
});
