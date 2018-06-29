using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Xml;

using Newtonsoft.Json;

namespace ConsoleApp1
{
    class Program
    {
        private const int WIDTH = 50;
        private const int HEIGHT = 25;

        static void Main(string[] args)
        {
            XmlDocument doc = new XmlDocument();
            doc.PreserveWhitespace = true;
            try
            {
                doc.Load("../../../maze" + WIDTH + "x" + HEIGHT + ".svg");

                XmlNodeList lineNodes = doc.GetElementsByTagName("line");

                List<Tuple<Point, Point>> svgData = new List<Tuple<Point, Point>>();

                var hasTopBorderData = new bool[WIDTH, HEIGHT];
                var hasLeftBorderData = new bool[WIDTH, HEIGHT];
                var hasBottomBorderData = new bool[WIDTH, HEIGHT];
                var hasRightBorderData = new bool[WIDTH, HEIGHT];

                SortedSet<int> sortedXs = new SortedSet<int>();
                SortedSet<int> sortedYs = new SortedSet<int>();

                foreach (XmlNode lineNode in lineNodes)
                {
                    if (lineNode.Attributes == null)
                    {
                        continue;
                    }

                    int x1 = Int32.Parse(lineNode.Attributes.GetNamedItem("x1").Value);
                    int x2 = Int32.Parse(lineNode.Attributes.GetNamedItem("x2").Value);
                    int y1 = Int32.Parse(lineNode.Attributes.GetNamedItem("y1").Value);
                    int y2 = Int32.Parse(lineNode.Attributes.GetNamedItem("y2").Value);

                    var nextPointSet = Tuple.Create(new Point(x1, y1), new Point(x2, y2));
                    svgData.Add(nextPointSet);

                    sortedXs.Add(x1);
                    sortedYs.Add(y1);
                }

                List<int> sortedXList = sortedXs.ToList();
                List<int> sortedYList = sortedYs.ToList();

                //sortedXList.RemoveAt(sortedXList.Count - 1);
                //sortedYList.RemoveAt(sortedYList.Count - 1);

                foreach (Tuple<Point, Point> svgTuple in svgData)
                {
                    //x2 > x1
                    if (((Point) svgTuple.Item2).X > ((Point) svgTuple.Item1).X)
                    {
                        int startIndex = sortedXList.IndexOf((int)((Point) svgTuple.Item1).X);
                        int endIndex = sortedXList.IndexOf((int)((Point)svgTuple.Item2).X);

                        //y2 should equal y1, in this case
                        int yIndex = sortedYList.IndexOf((int)((Point)svgTuple.Item1).Y);
                        for (int i = startIndex; i < endIndex; i++)
                        {
                            if (yIndex != sortedYList.Count - 1)
                            {
                                hasTopBorderData[i, yIndex] = true;
                            }
                            else
                            {
                                hasBottomBorderData[i, yIndex - 1] = true;
                            }
                        }
                    }
                    //x2 < x1
                    else if (((Point) svgTuple.Item2).X < ((Point) svgTuple.Item1).X)
                    {
                        int startIndex = sortedXList.IndexOf((int)((Point)svgTuple.Item2).X);
                        int endIndex = sortedXList.IndexOf((int)((Point)svgTuple.Item1).X);

                        //y2 should equal y1, in this case
                        int yIndex = sortedYList.IndexOf((int)((Point)svgTuple.Item1).Y);
                        for (int i = startIndex; i < endIndex; i++)
                        {
                            if (yIndex != sortedYList.Count - 1)
                            {
                                hasTopBorderData[i, yIndex] = true;
                            }
                            else
                            {
                                hasBottomBorderData[i, yIndex - 1] = true;
                            }
                        }
                    }
                    //y2 > y1
                    else if ((((Point) svgTuple.Item2).Y > ((Point) svgTuple.Item1).Y))
                    {
                        int startIndex = sortedYList.IndexOf((int)((Point)svgTuple.Item1).Y);
                        int endIndex = sortedYList.IndexOf((int)((Point)svgTuple.Item2).Y);

                        //x2 should equal x1, in this case
                        int xIndex = sortedXList.IndexOf((int)((Point)svgTuple.Item1).X);
                        for (int i = startIndex; i < endIndex; i++)
                        {
                            if (xIndex != sortedXList.Count - 1)
                            {
                                hasLeftBorderData[xIndex, i] = true;
                            }
                            else
                            {
                                hasRightBorderData[xIndex - 1, i] = true;
                            }
                        }
                    }
                    //y2 < y1
                    else if ((((Point)svgTuple.Item2).Y < ((Point)svgTuple.Item1).Y))
                    {
                        int startIndex = sortedYList.IndexOf((int)((Point)svgTuple.Item2).Y);
                        int endIndex = sortedYList.IndexOf((int)((Point)svgTuple.Item1).Y);

                        //x2 should equal x1, in this case
                        int xIndex = sortedXList.IndexOf((int)((Point)svgTuple.Item1).X);
                        for (int i = startIndex; i < endIndex; i++)
                        {
                            if (xIndex != sortedXList.Count - 1)
                            {
                                hasLeftBorderData[xIndex, i] = true;
                            }
                            else
                            {
                                hasRightBorderData[xIndex - 1, i] = true;
                            }
                        }
                    }
                }



                StringBuilder sb = new StringBuilder();
                StringWriter sw = new StringWriter(sb);

                //generate JSON from data
                using (JsonWriter writer = new JsonTextWriter(sw))
                {
                    writer.Formatting = Newtonsoft.Json.Formatting.Indented;

                    //writer.WriteStartObject();
                    //writer.WritePropertyName("row0");
                    //writer.WriteStartObject();
                    //writer.WritePropertyName("col0");
                    //writer.WriteStartObject();
                    //writer.WritePropertyName("L");
                    //writer.WriteValue(false);
                    //writer.WritePropertyName("T");
                    //writer.WriteValue(false);
                    //writer.WritePropertyName("R");
                    //writer.WriteValue(false);
                    //writer.WritePropertyName("B");
                    //writer.WriteValue(false);
                    //writer.WriteEndObject();
                    //writer.WriteEndObject();
                    //writer.WriteEndObject();

                    writer.WriteStartObject();

                    for (int i = 0; i < sortedXList.Count - 1; i++)
                    {
                        writer.WritePropertyName("row" + i);
                        writer.WriteStartObject();
                        for (int j = 0; j < sortedYList.Count - 1; j++)
                        {
                            writer.WritePropertyName("col" + j);
                            writer.WriteStartObject();
                            writer.WritePropertyName("L");
                            writer.WriteValue(hasLeftBorderData[i, j]);
                            writer.WritePropertyName("T");
                            writer.WriteValue(hasTopBorderData[i, j]);
                            writer.WritePropertyName("R");
                            writer.WriteValue(hasRightBorderData[i, j]);
                            writer.WritePropertyName("B");
                            writer.WriteValue(hasBottomBorderData[i, j]);
                            writer.WriteEndObject();
                        }
                        writer.WriteEndObject();
                    }

                    writer.WriteEndObject();
                }

                using (StreamWriter swriter = new StreamWriter("../../../squareBorders.json"))
                {
                    swriter.Write(sb.ToString());
                }
            }
            catch (Exception ex)
            {

            }
        }
    }
}
