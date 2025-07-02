import React from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  Input, 
  Badge, 
  Alert 
} from './ui';
import { 
  ArrowRightIcon, 
  EyeIcon, 
  MailIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function DesignShowcase() {
  return (
    <div className="min-h-screen bg-gray-0 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="t-display-md text-gray-900 mb-4">
            ADOC Design System
          </h1>
          <p className="t-body-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive design system inspired by Tailscale's clean, modern interface.
          </p>
        </div>

        {/* Typography Section */}
        <section className="mb-16">
          <h2 className="t-h2 text-gray-900 mb-8">Typography</h2>
          <Card>
            <CardBody className="space-y-6">
              <div>
                <h1 className="t-display-lg text-gray-900 mb-2">Display Large</h1>
                <p className="t-caption text-gray-500">Hero headlines and main titles</p>
              </div>
              <div>
                <h2 className="t-h2 text-gray-900 mb-2">Heading 2</h2>
                <p className="t-caption text-gray-500">Section headings</p>
              </div>
              <div>
                <h3 className="t-h3 text-gray-900 mb-2">Heading 3</h3>
                <p className="t-caption text-gray-500">Subsection headings</p>
              </div>
              <div>
                <h4 className="t-h4 text-gray-900 mb-2">Heading 4</h4>
                <p className="t-caption text-gray-500">Card headings</p>
              </div>
              <div>
                <h5 className="t-h5 text-gray-900 mb-2">Heading 5</h5>
                <p className="t-caption text-gray-500">Small headings</p>
              </div>
              <div>
                <h6 className="t-h6 text-gray-900 mb-2">Heading 6</h6>
                <p className="t-caption text-gray-500">Micro headings</p>
              </div>
              <div>
                <p className="t-body-lg text-gray-900 mb-2">Body Large Text</p>
                <p className="t-caption text-gray-500">Large body text for emphasis</p>
              </div>
              <div>
                <p className="t-body text-gray-900 mb-2">Body Text</p>
                <p className="t-caption text-gray-500">Standard body text</p>
              </div>
              <div>
                <p className="t-body-sm text-gray-900 mb-2">Body Small Text</p>
                <p className="t-caption text-gray-500">Small body text</p>
              </div>
              <div>
                <p className="t-caption text-gray-900 mb-2">Caption Text</p>
                <p className="t-caption-sm text-gray-500">Small captions and metadata</p>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="t-h2 text-gray-900 mb-8">Buttons</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <h3 className="t-h5">Button Variants</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="t-h5">Button Sizes</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="t-h5">Button States</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button>Normal</Button>
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="t-h5">Button with Icons</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button icon={<ArrowRightIcon className="w-4 h-4" />}>
                    With Icon
                  </Button>
                  <Button icon={<ArrowRightIcon className="w-4 h-4" />} iconPosition="right">
                    Icon Right
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="t-h2 text-gray-900 mb-8">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="default">
              <CardHeader>
                <h3 className="t-h5">Default Card</h3>
              </CardHeader>
              <CardBody>
                <p className="t-body text-gray-600">
                  This is a default card with subtle shadow and border.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <h3 className="t-h5">Elevated Card</h3>
              </CardHeader>
              <CardBody>
                <p className="t-body text-gray-600">
                  This card has enhanced shadow for more prominence.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <h3 className="t-h5">Outlined Card</h3>
              </CardHeader>
              <CardBody>
                <p className="t-body text-gray-600">
                  This card has a prominent border without shadow.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="mb-16">
          <h2 className="t-h2 text-gray-900 mb-8">Inputs</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <h3 className="t-h5">Input Variants</h3>
              </CardHeader>
              <CardBody className="space-y-6">
                <Input 
                  label="Standard Input"
                  placeholder="Enter text here"
                />
                <Input 
                  label="Input with Helper Text"
                  placeholder="Enter email"
                  helperText="We'll never share your email"
                />
                <Input 
                  label="Input with Error"
                  placeholder="Enter email"
                  error="Please enter a valid email address"
                />
                <Input 
                  label="Input with Icons"
                  placeholder="Enter password"
                  leftIcon={<MailIcon className="w-4 h-4" />}
                  rightIcon={<EyeIcon className="w-4 h-4" />}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="t-h5">Input Types</h3>
              </CardHeader>
              <CardBody className="space-y-6">
                <Input 
                  label="Email Input"
                  type="email"
                  placeholder="user@example.com"
                />
                <Input 
                  label="Password Input"
                  type="password"
                  placeholder="Enter password"
                />
                <Input 
                  label="Number Input"
                  type="number"
                  placeholder="Enter number"
                />
                <Input 
                  label="Search Input"
                  type="search"
                  placeholder="Search..."
                />
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section className="mb-16">
          <h2 className="t-h2 text-gray-900 mb-8">Badges</h2>
          <Card>
            <CardBody>
              <div className="space-y-8">
                <div>
                  <h3 className="t-h5 mb-4">Badge Variants</h3>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="gray">Gray</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="t-h5 mb-4">Badge Sizes</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <Badge size="sm">Small</Badge>
                    <Badge size="md">Medium</Badge>
                    <Badge size="lg">Large</Badge>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Alerts Section */}
        <section className="mb-16">
          <h2 className="t-h2 text-gray-900 mb-8">Alerts</h2>
          <div className="space-y-6">
            <Alert variant="info" title="Information">
              This is an informational message with additional details about the current process.
            </Alert>
            <Alert variant="success" title="Success">
              Your action was completed successfully. All changes have been saved.
            </Alert>
            <Alert variant="warning" title="Warning">
              Please review your input before proceeding. Some fields may need attention.
            </Alert>
            <Alert variant="error" title="Error">
              Something went wrong. Please try again or contact support if the problem persists.
            </Alert>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="mb-16">
          <h2 className="t-h2 text-gray-900 mb-8">Color Palette</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <h3 className="t-h5">Primary Colors</h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto mb-2"></div>
                    <p className="t-caption-sm text-gray-600">Blue 500</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-2"></div>
                    <p className="t-caption-sm text-gray-600">Blue 600</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-700 rounded-lg mx-auto mb-2"></div>
                    <p className="t-caption-sm text-gray-600">Blue 700</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="t-h5">Semantic Colors</h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-lg mx-auto mb-2"></div>
                    <p className="t-caption-sm text-gray-600">Success</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-600 rounded-lg mx-auto mb-2"></div>
                    <p className="t-caption-sm text-gray-600">Error</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-600 rounded-lg mx-auto mb-2"></div>
                    <p className="t-caption-sm text-gray-600">Warning</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Utility Classes Section */}
        <section className="mb-16">
          <h2 className="t-h2 text-gray-900 mb-8">Utility Classes</h2>
          <Card>
            <CardBody className="space-y-6">
              <div>
                <h3 className="t-h5 mb-4">Gradient Text</h3>
                <p className="text-gradient t-h3">
                  This text has a gradient effect
                </p>
              </div>
              <div>
                <h3 className="t-h5 mb-4">Glass Effect</h3>
                <div className="glass p-6 rounded-lg">
                  <p className="t-body">This element has a glass morphism effect</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
} 