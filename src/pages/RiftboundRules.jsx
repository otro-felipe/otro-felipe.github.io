import { useMemo, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Card,
  CardContent,
  Collapse,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  GlobalStyles,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { marked } from 'marked';
import faqEntries from '../data/riftboundFaq.json';

marked.setOptions({ breaks: true });

const markdownToHtml = (content) => ({
  __html: marked.parse(content ?? '')
});

const markdownToPlainText = (content = '') =>
  content
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/<[^>]+>/g, '');

const normalizeSections = (section) => {
  if (!section) return [];
  return Array.isArray(section) ? section : [section];
};

const RuleReferenceSection = ({ rules }) => {
  if (!rules?.length) return null;

  return (
    <Stack spacing={1.5}>
      {rules.map((rule) => {
        const indentLevel = (rule.number.match(/\./g) || []).length;
        const textIndent = indentLevel * 2;

        return (
          <Grid
            key={rule.number}
            container
            columns={12}
            spacing={1}
            alignItems="flex-start"
          >
            <Grid size={{ xs: 12, sm: 2 }}>
              <Typography fontWeight={600}>{rule.number}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 10 }} sx={{ pl: { xs: 0, sm: textIndent } }}>
              <Typography color="text.secondary">{rule.text}</Typography>
            </Grid>
          </Grid>
        );
      })}
    </Stack>
  );
};

const CardImageSection = ({ cards }) => {
  if (!cards?.length) return null;

  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 1, sm: 6, md: 9 }}
      justifyContent={{ xs: 'center', sm: 'space-around' }}
    >
      {cards.map((card, index) => {
        const plainAltText = markdownToPlainText(card.text);

        return (
          <Grid
            key={`${card.text}-${index}`}
            size={{ xs: 1, sm: 3, md: 3 }}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Stack spacing={1.5} alignItems="center" sx={{ textAlign: 'center', maxWidth: 220, width: '100%' }}>
              <Box
                component="img"
                src={card.url}
                alt={plainAltText}
                sx={{
                  width: '100%',
                  borderRadius: 1,
                  boxShadow: 3,
                  objectFit: 'cover'
                }}
              />
              <Box
                sx={{ color: 'text.primary' }}
                component="div"
                dangerouslySetInnerHTML={markdownToHtml(card.text)}
              />
              {card.errata && (
                <Typography variant="body2" color="warning.main" sx={{ fontStyle: 'italic' }}>
                  {card.errata}
                </Typography>
              )}
            </Stack>
          </Grid>
        );
      })}
    </Grid>
  );
};

const DetailSection = ({ section }) => {
  switch (section.type) {
    case 'text':
      return (
        <Box
          component="div"
          sx={{ color: 'text.secondary' }}
          dangerouslySetInnerHTML={markdownToHtml(section.text)}
        />
      );
    case 'rule_reference':
      return <RuleReferenceSection rules={section.rules} />;
    case 'card_image':
      return <CardImageSection cards={section.cards} />;
    default:
      return null;
  }
};

function RiftboundRules() {
  const [openItems, setOpenItems] = useState(() => new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleItem = (id) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const entries = useMemo(() => faqEntries, []);
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredEntries = useMemo(() => {
    if (!normalizedSearch) return entries;

    return entries.filter((entry) => {
      const searchableChunks = [
        markdownToPlainText(entry.title),
        markdownToPlainText(entry.short_answer)
      ];
      const sections = normalizeSections(entry.detail_section);

      sections.forEach((section) => {
        switch (section.type) {
          case 'text':
            searchableChunks.push(markdownToPlainText(section.text));
            break;
          case 'rule_reference':
            section.rules?.forEach((rule) => {
              searchableChunks.push(rule.number, rule.text);
            });
            break;
          case 'card_image':
            section.cards?.forEach((card) => {
              searchableChunks.push(markdownToPlainText(card.text));
              if (card.errata) searchableChunks.push(card.errata);
            });
            break;
          default:
            break;
        }
      });

      const combined = searchableChunks.filter(Boolean).join(' ').toLowerCase();
      return combined.includes(normalizedSearch);
    });
  }, [entries, normalizedSearch]);

  return (
    <>
      <GlobalStyles
        styles={{
          '[data-keyword-bgreen]': {
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '2.25rem',
            padding: '0.2rem 0.4rem',
            fontSize: '0.75rem',
            fontWeight: 1000,
            textTransform: 'uppercase',
            color: '#000000',
            margin: '0 0.25rem',
            textAlign: 'center',
            backgroundColor: '#14e06d',
            boxShadow: '0 0 0 1px rgba(15, 23, 42, 0.2)',
            transform: 'skewX(-20deg)',
            borderRadius: 4
          }
        }}
      />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        <Stack spacing={4}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              bgcolor: 'rgba(148, 163, 184, 0.08)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Stack
            spacing={2}
            alignItems={{ xs: 'center', md: 'flex-start' }}
            sx={{ textAlign: { xs: 'center', md: 'left' } }}
          >
            <Box
              component="img"
              src="/img/riftbound.svg"
              alt="Logo de Riftbound"
              sx={{ width: 96, height: 'auto' }}
            />
            <Typography variant="h3" component="h1">
              FAQ Riftbound Chile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Este compendio reúne preguntas frecuentes de la comunidad y ofrece respuestas
              fundamentadas directamente en el reglamento oficial de Riftbound. La idea es convertirse
              en una referencia rápida que puedas consultar para resolver cualquier duda que surja sobre el
              juego.
            </Typography>
          </Stack>
        </Paper>

        <TextField
          fullWidth
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar pregunta, regla o palabra clave..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
        />

        <Stack spacing={2}>
          {filteredEntries.map((entry, index) => {
            const titleHtml = entry.title ?? '';
            const shortAnswerHtml = entry.short_answer ?? '';
            const plainTitle = markdownToPlainText(titleHtml);
            const entryId = plainTitle || titleHtml;
            const isOpen = openItems.has(entryId);
            const detailSections = normalizeSections(entry.detail_section);
            const panelId = `question-details-${index}`;

            return (
              <Card key={entryId}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        dangerouslySetInnerHTML={{ __html: titleHtml }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                        dangerouslySetInnerHTML={{ __html: shortAnswerHtml }}
                      />
                    </Box>
                    <IconButton
                      onClick={() => toggleItem(entryId)}
                      aria-label={isOpen ? 'Ocultar detalles' : 'Mostrar detalles'}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      sx={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 150ms ease'
                      }}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <Divider />
                  <CardContent id={panelId}>
                    <Stack spacing={3}>
                      {detailSections.map((section, sectionIndex) => (
                        <DetailSection section={section} key={`${entryId}-${sectionIndex}`} />
                      ))}
                    </Stack>
                  </CardContent>
                </Collapse>
              </Card>
            );
          })}
          {!filteredEntries.length && (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No encontramos resultados para “{searchTerm}”. Intenta con otro término.
              </Typography>
            </Paper>
          )}
        </Stack>
        </Stack>
      </Container>
    </>
  );
}

export default RiftboundRules;
