interface ProseProps {
  content: any;
  className?: string;
}

export function Prose({ content, className = '' }: ProseProps) {
  const renderNode = (node: any): React.ReactNode => {
    if (!node) return null;

    switch (node.type) {
      case 'paragraph':
        return (
          <p>
            {node.content?.map((child: any, index: number) => (
              <span key={index}>{renderNode(child)}</span>
            ))}
          </p>
        );

      case 'heading':
        const level = node.attrs?.level || 1;
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        return (
          <Tag>
            {node.content?.map((child: any, index: number) => (
              <span key={index}>{renderNode(child)}</span>
            ))}
          </Tag>
        );

      case 'text':
        let text = node.text || '';
        
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            switch (mark.type) {
              case 'bold':
                text = <strong key="bold">{text}</strong>;
                break;
              case 'italic':
                text = <em key="italic">{text}</em>;
                break;
              case 'link':
                text = (
                  <a
                    key="link"
                    href={mark.attrs?.href}
                    target={mark.attrs?.target}
                    rel="noopener noreferrer"
                  >
                    {text}
                  </a>
                );
                break;
            }
          });
        }
        
        return text;

      case 'bulletList':
        return (
          <ul>
            {node.content?.map((child: any, index: number) => (
              <li key={index}>{renderNode(child)}</li>
            ))}
          </ul>
        );

      case 'orderedList':
        return (
          <ol>
            {node.content?.map((child: any, index: number) => (
              <li key={index}>{renderNode(child)}</li>
            ))}
          </ol>
        );

      case 'listItem':
        return node.content?.map((child: any, index: number) => (
          <span key={index}>{renderNode(child)}</span>
        ));

      case 'blockquote':
        return (
          <blockquote>
            {node.content?.map((child: any, index: number) => (
              <div key={index}>{renderNode(child)}</div>
            ))}
          </blockquote>
        );

      case 'hardBreak':
        return <br />;

      default:
        if (node.content) {
          return node.content.map((child: any, index: number) => (
            <span key={index}>{renderNode(child)}</span>
          ));
        }
        return null;
    }
  };

  if (!content || !content.content) {
    return null;
  }

  return (
    <div className={`prose-custom ${className}`}>
      {content.content.map((node: any, index: number) => (
        <div key={index}>{renderNode(node)}</div>
      ))}
    </div>
  );
}

