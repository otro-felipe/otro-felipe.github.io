import Grid from '@mui/material/Grid';
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const projects = [
  {
    title: 'FAQ Riftbound Chile',
    description: 'Compilación de reglas, preguntas frecuentes y referencias oficiales para Riftbound.',
    to: '/reglas-riftbound',
    image: '/img/riftbound.svg',
    imageAlt: 'Logo de Riftbound'
  },
  {
    title: 'Escúchame en Spotify',
    description:
      'Compongo y grabo mi propia música. Fuerte influencia del género emo pop punk (coloquialmente conocido como emo).',
    href: 'https://open.spotify.com/artist/0IohiuiKUbTVN4KW9I8sWm?si=e0784257099e4d0d',
    image: '/img/spotify.png',
    imageAlt: 'Logo de Spotify'
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
              src="/img/avatar.jpg"
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
                Ingeniero Civil en Computación, desarrollador de software y líder técnico. Me apasionan los videojuegos y los TCG, así como también la música y la ciencia. En esta GitHub Page comparto los proyectos personales que voy realizando.
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
              {projects.map((project) => {
                const actionProps = project.href
                  ? {
                      component: 'a',
                      href: project.href,
                      target: '_blank',
                      rel: 'noopener noreferrer'
                    }
                  : {
                      component: RouterLink,
                      to: project.to
                    };

                return (
                  <Card key={project.title} sx={{ height: '100%' }}>
                    <CardActionArea {...actionProps}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={3}
                        alignItems={{ xs: 'center', sm: 'flex-start' }}
                        sx={{ textAlign: { xs: 'center', sm: 'left' }, p: { xs: 2, sm: 3 } }}
                      >
                        {project.image && (
                          <CardMedia
                            component="img"
                            image={project.image}
                            alt={project.imageAlt ?? project.title}
                            sx={{
                              width: { xs: 160, sm: 120 },
                              height: { xs: 160, sm: 120 },
                              objectFit: 'contain',
                              bgcolor: 'rgba(148, 163, 184, 0.12)',
                              borderRadius: 2,
                              p: 2
                            }}
                          />
                        )}
                        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
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
                      </Stack>
                    </CardActionArea>
                  </Card>
                );
              })}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
