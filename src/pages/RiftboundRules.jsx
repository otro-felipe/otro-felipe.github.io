import { useEffect, useMemo, useState } from 'react';
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

const KEYWORD_TOKEN_PATTERN = /\[\[KEYWORD\|([a-z]+)\|([^\]]+)\]\]/gi;

const createKeywordToken = (tone, label) =>
  `[[KEYWORD|${tone}|${label.trim()}]]`;

const normalizeKeywordLabel = (base, rawSuffix = '') => {
  const suffix = rawSuffix?.trim() ?? '';
  return suffix ? `${base} ${suffix.toUpperCase()}` : base;
};

const keywordPlaceholderRules = [
  {
    regex: /<reaction\s*>/gi,
    color: 'green',
    getLabel: () => 'REACTION'
  },
  {
    regex: /<action\s*>/gi,
    color: 'green',
    getLabel: () => 'ACTION'
  },
  {
    regex: /<hidden\s*>/gi,
    color: 'green',
    getLabel: () => 'HIDDEN'
  },
  {
    regex: /<shield\s*([+\d]+)?\s*>/gi,
    color: 'pink',
    getLabel: (_, value = '') => normalizeKeywordLabel('SHIELD', value)
  },
  {
    regex: /<assault\s*([+\d]+)?\s*>/gi,
    color: 'pink',
    getLabel: (_, value = '') => normalizeKeywordLabel('ASSAULT', value)
  },
  {
    regex: /<tank\s*>/gi,
    color: 'pink',
    getLabel: () => 'TANK'
  },
  {
    regex: /<deflect\s*>/gi,
    color: 'bgreen',
    getLabel: () => 'DEFLECT'
  },
  {
    regex: /<deathknell\s*>/gi,
    color: 'bgreen',
    getLabel: () => 'DEATHKNELL'
  },
  {
    regex: /<temporary\s*>/gi,
    color: 'bgreen',
    getLabel: () => 'TEMPORARY'
  }
];

const tokenizeContent = (content = '', _mode = 'general') =>
  keywordPlaceholderRules.reduce((text, rule) => {
    return text.replace(rule.regex, (...args) =>
      createKeywordToken(rule.color, rule.getLabel(...args))
    );
  }, content ?? '');

const detokenizeContent = (html = '') =>
  html.replace(KEYWORD_TOKEN_PATTERN, (_, tone, label) => {
    return `<span data-keyword-${tone}><span>${label}</span></span>`;
  });

const replaceKeywordTokensWithLabels = (content = '') =>
  content.replace(KEYWORD_TOKEN_PATTERN, (_, __, label) => label);

const markdownToHtml = (
  content,
  { decorateKeywords = false, decoratorMode = 'general', inline = false } = {}
) => {
  const source = content ?? '';
  const prepared = decorateKeywords
    ? tokenizeContent(source, decoratorMode)
    : source;
  const parsed = inline ? marked.parseInline(prepared) : marked.parse(prepared);
  const withKeywords = decorateKeywords ? detokenizeContent(parsed) : parsed;

  return {
    __html: withKeywords
  };
};

const replaceKeywordPlaceholdersWithLabels = (content = '', mode = 'general') =>
  replaceKeywordTokensWithLabels(tokenizeContent(content, mode));

const markdownToPlainText = (content = '', { mode = 'general' } = {}) =>
  replaceKeywordPlaceholdersWithLabels(content, mode)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();

const normalizeSections = (section) => {
  if (!section) return [];
  return Array.isArray(section) ? section : [section];
};

const createEntryAnchorId = (title = '') => {
  if (!title) return '';
  return `faq-${title
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')}`;
};

const sanitizeHash = (hash = '') => String(hash ?? '').replace(/^#/, '');

const setUrlHash = (hash = '') => {
  if (typeof window === 'undefined' || !window.history?.replaceState) return;
  const sanitized = sanitizeHash(hash);
  const { pathname, search } = window.location;
  const nextUrl = sanitized ? `${pathname}${search}#${sanitized}` : `${pathname}${search}`;
  window.history.replaceState(null, '', nextUrl);
};

const scrollToAnchor = (hash = '') => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const target = document.getElementById(sanitizeHash(hash));
  if (target) {
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
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
              <Typography
                color="text.secondary"
                component="div"
                dangerouslySetInnerHTML={markdownToHtml(rule.text, {
                  decorateKeywords: true,
                  decoratorMode: 'general',
                  inline: true
                })}
              />
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
        const plainAltText = markdownToPlainText(card.text, { mode: 'card' });

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
                sx={{ color: 'text.primary', fontSize: '0.8125rem', lineHeight: 1.4 }}
                component="div"
                dangerouslySetInnerHTML={markdownToHtml(card.text, {
                  decorateKeywords: true,
                  decoratorMode: 'card'
                })}
              />
              {card.errata && (
                <Typography
                  variant="body2"
                  color="warning.main"
                  sx={{ fontStyle: 'italic' }}
                  component="div"
                  dangerouslySetInnerHTML={markdownToHtml(card.errata, {
                    decorateKeywords: true,
                    decoratorMode: 'general',
                    inline: true
                  })}
                />
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
          dangerouslySetInnerHTML={markdownToHtml(section.text, {
            decorateKeywords: true,
            decoratorMode: 'general'
          })}
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

  const toggleItem = (id, anchorId) => {
    let wasOpen = false;
    let isOpening = false;

    setOpenItems((prev) => {
      const next = new Set(prev);
      wasOpen = next.has(id);

      if (wasOpen) {
        next.delete(id);
      } else {
        next.add(id);
        isOpening = true;
      }
      return next;
    });

    if (typeof window === 'undefined') return;

    const hashValue = sanitizeHash(anchorId);

    if (isOpening && hashValue) {
      setUrlHash(hashValue);
      scrollToAnchor(hashValue);
    } else if (!isOpening && wasOpen) {
      const currentHash = sanitizeHash(window.location.hash);
      if (currentHash === hashValue) {
        setUrlHash('');
      }
    }
  };

  const entries = useMemo(() => faqEntries, []);
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredEntries = useMemo(() => {
    if (!normalizedSearch) return entries;

    return entries.filter((entry) => {
      const searchableChunks = [
        markdownToPlainText(entry.title, { mode: 'general' }),
        markdownToPlainText(entry.short_answer, { mode: 'general' })
      ];
      const sections = normalizeSections(entry.detail_section);

      sections.forEach((section) => {
        switch (section.type) {
          case 'text':
            searchableChunks.push(
              markdownToPlainText(section.text, { mode: 'general' })
            );
            break;
          case 'rule_reference':
            section.rules?.forEach((rule) => {
              searchableChunks.push(
                rule.number,
                markdownToPlainText(rule.text, { mode: 'general' })
              );
            });
            break;
          case 'card_image':
            section.cards?.forEach((card) => {
              searchableChunks.push(
                markdownToPlainText(card.text, { mode: 'card' })
              );
              if (card.errata) {
                searchableChunks.push(
                  markdownToPlainText(card.errata, { mode: 'general' })
                );
              }
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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let locationHash = window.location.hash || '';
    try {
      locationHash = decodeURIComponent(locationHash);
    } catch (error) {
      // Ignore malformed URI sequences and fall back to the raw hash.
    }

    const rawHash = sanitizeHash(locationHash);
    if (!rawHash) return;

    const matchingEntry = entries.find((entry) => {
      const titleContent = entry.title ?? '';
      const plainTitle = markdownToPlainText(titleContent, { mode: 'general' });
      const entryId = plainTitle || titleContent;
      const anchorId = createEntryAnchorId(entryId);
      return anchorId === rawHash;
    });

    if (!matchingEntry) return;

    const titleContent = matchingEntry.title ?? '';
    const plainTitle = markdownToPlainText(titleContent, { mode: 'general' });
    const entryId = plainTitle || titleContent;
    setOpenItems((prev) => {
      if (prev.has(entryId)) return prev;
      const next = new Set(prev);
      next.add(entryId);
      return next;
    });

    scrollToAnchor(rawHash);
  }, [entries]);

  return (
    <>
      <GlobalStyles
        styles={{
          '[data-keyword-bgreen], [data-keyword-green], [data-keyword-pink]': {
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '2.25rem',
            padding: '0.1rem 0.3rem',
            fontSize: '0.75rem',
            fontWeight: 1000,
            textTransform: 'uppercase',
            color: '#FFFFFF',
            margin: '0 0.25rem',
            textAlign: 'center',
            fontStyle: 'normal',
            boxShadow: '0 0 0 1px rgba(15, 23, 42, 0.2)',
            transform: 'skewX(-20deg)',
            borderRadius: 4
          },
          '[data-keyword-bgreen]': {
            backgroundColor: '#14e06d',
            color: '#000000'
          },
          '[data-keyword-green]': {
            backgroundColor: '#258338'
          },
          '[data-keyword-pink]': {
            backgroundColor: '#e53277'
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
            const titleContent = entry.title ?? '';
            const shortAnswerContent = entry.short_answer ?? '';
            const plainTitle = markdownToPlainText(titleContent, { mode: 'general' });
            const entryId = plainTitle || titleContent;
            const decoratedTitle = markdownToHtml(titleContent, {
              decorateKeywords: true,
              decoratorMode: 'general',
              inline: true
            });
            const decoratedShortAnswer = markdownToHtml(shortAnswerContent, {
              decorateKeywords: true,
              decoratorMode: 'general',
              inline: true
            });
            const isOpen = openItems.has(entryId);
            const detailSections = normalizeSections(entry.detail_section);
            const panelId = `question-details-${index}`;
            const anchorId = createEntryAnchorId(entryId);

            return (
              <Card key={entryId} id={anchorId || undefined}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        dangerouslySetInnerHTML={decoratedTitle}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                        dangerouslySetInnerHTML={decoratedShortAnswer}
                      />
                    </Box>
                    <IconButton
                      onClick={() => toggleItem(entryId, anchorId)}
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
