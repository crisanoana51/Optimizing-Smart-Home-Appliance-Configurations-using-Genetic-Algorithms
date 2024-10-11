package licenta.retrievedata.entitites;


import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "device")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;


    private String category;

    private BigDecimal price;

    private double consumption;

    private String consumptionClass;

    private Double length;

    private Double width;

    private Double height;

    private String imageUrl;

    private String url;


    public Device(Long id, String name, String category, BigDecimal price, double consumption, String consumptionClass, Double length, Double width, Double height, String imageUrl, String url) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.consumption = consumption;
        this.consumptionClass = consumptionClass;
        this.length = length;
        this.width = width;
        this.height = height;
        this.imageUrl = imageUrl;
        this.url = url;
    }

    public Device() {

    }

    public Double getLength() {
        return length;
    }

    public void setLength(Double length) {
        this.length = length;
    }

    public Double getWidth() {
        return width;
    }

    public void setWidth(Double width) {
        this.width = width;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public double getConsumption() {
        return consumption;
    }

    public void setConsumption(double consumption) {
        this.consumption = consumption;
    }

    public String getConsumptionClass() {
        return consumptionClass;
    }

    public void setConsumptionClass(String consumptionClass) {
        this.consumptionClass = consumptionClass;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
