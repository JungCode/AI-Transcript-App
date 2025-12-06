const markdownStyles = {
  body: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Nunito',
    lineHeight: 28,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 12,
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Nunito',
    lineHeight: 28,
  },
  heading1: {
    fontSize: 24,
    color: '#C2F590',
    fontFamily: 'Nunito',
    fontWeight: 'bold' as const,
    lineHeight: 36,
    marginBottom: 16,
  },
  heading2: {
    fontSize: 22,
    color: '#C2F590',
    fontFamily: 'Nunito',
    fontWeight: 'bold' as const,
    lineHeight: 32,
    marginBottom: 12,
  },
  heading3: {
    fontSize: 20,
    color: '#C2F590',
    fontFamily: 'Nunito',
    fontWeight: 'bold' as const,
    lineHeight: 30,
    marginBottom: 8,
  },
  strong: {
    fontWeight: 'bold' as const,
    color: '#C2F590', // mirai-lime color for emphasis
    lineHeight: 28,
  },
  em: {
    fontStyle: 'italic' as const,
    color: '#E7E9DD', // mirai-light color
    lineHeight: 28,
  },
  code_inline: {
    backgroundColor: '#314C19', // mirai-greenDark
    color: '#C2F590',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  code_block: {
    backgroundColor: '#314C19',
    color: '#C2F590',
    padding: 12,
    borderRadius: 8,
    fontFamily: 'monospace',
  },
  bullet_list: {
    marginBottom: 8,
  },
  ordered_list: {
    marginBottom: 8,
  },
  list_item: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Nunito',
    lineHeight: 28,
    marginBottom: 4,
  },
};

const userMessageStyle = {
  fontSize: 18,
  color: '#ffffff',
  fontFamily: 'Nunito',
  lineHeight: 28,
};

export { markdownStyles, userMessageStyle };
