import Grid from '@mui/material/Grid';
import { Avatar, Card, CardActionArea, CardContent, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const projects = [
  {
    title: 'Riftbound Rules',
    description: 'Compilación de reglas y referencias para Riftbound.',
    to: '/reglas-rigtbound'
  }
];

function Home() {
  return (
    <Container sx={{ py: { xs: 4, md: 8 } }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
              p: { xs: 3, md: 4 },
              bgcolor: 'rgba(148, 163, 184, 0.08)',
              backdropFilter: 'blur(8px)',
              textAlign: { xs: 'center', md: 'left' },
              alignItems: { xs: 'center', md: 'flex-start' }
            }}
          >
            <Avatar
              src="/avatar.jpg"
              alt="Felipe Pezoa"
              sx={{ width: 160, height: 160, boxShadow: 3 }}
            />
            <Stack spacing={1}>
              <Typography variant="h4" component="h1" gutterBottom>
                Felipe Pezoa
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
              >
                Desarrollador y entusiasta de los juegos de rol. Aquí comparto proyectos, reglas y recursos que voy creando.
              </Typography>
            </Stack>
            <Divider flexItem sx={{ width: { xs: '100%', md: 'auto' } }} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            <Typography variant="h5" component="h2">
              Proyectos
            </Typography>
            <Stack spacing={2} sx={{ flex: 1 }}>
              {projects.map((project) => (
                <Card
                  key={project.title}
                >
                  <CardActionArea component={RouterLink} to={project.to}>
                    <CardContent>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {project.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          textWrap: 'pretty',
                          overflowWrap: 'anywhere',
                          wordBreak: 'break-word'
                        }}
                      >
                        {project.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
